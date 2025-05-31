from langchain_core.tools import tool
from langchain_core.runnables import RunnableConfig
from sqlmodel import Session, text

from src.crud import user_crud


from src.agent.sub_graph.data_retrieval.helper import serialize_data


@tool("get_user_portofolio_company", parse_docstring=True)
def get_user_portofolio_company(config: RunnableConfig):
    """
    Retrieves the list of companies in the user's portfolio along with their ticker symbols.

    This tool should be used when the AI agent needs to access or analyze the user's current investment holdings,
    such as when generating portfolio performance reports, making investment recommendations, 
    or answering questions about specific assets. The standardized ticker symbols returned enable 
    the agent to efficiently lookup financial data and market information.

    Args:
    

    Returns:
        dict: A result object with either success or error status.
        - If success: 
            {
                'status': 'success',
                'data': [
                    {'company_name': str, 'ticker': str},
                    ...
                ]
            }
        - If error:
            {
                'status': 'error',
                'error': str  # Error message detailing failure reason
            }

        Possible errors include: portfolio data unavailable, authentication failure,
        or unexpected data format issues.

    Example:
        {'status': 'success', 'data': [{'company_name': 'Apple Inc.', 'ticker': 'AAPL'}, ...]}
        {'status': 'error', 'error': 'Failed to access portfolio database'}
    """

    # db = config["configurable"].get("db", None)
    from src.db.database import engine
    from sqlmodel import Session

    with Session(engine) as db:
        user_id = config["configurable"].get("user_id", None)

        if not user_id:
            return {
                "status": "error",
                "error": "There is not user logged in"
            }
        
        if isinstance(user_id, str) and user_id.isdigit():
            user_id = int(user_id)

        if not isinstance(user_id, int):
            return {
                "status": "error",
                "error": "Invalid user id"
            }
        
        companies = user_crud.get_user_company_by_user_id(db, user_id)
        company_list = []
        for company in companies:
            company_list.append({
                "company_name": company.name,
                "ticker": company.ticker
            })
        
        return {
            "status": "success",
            "data": company_list
        }

def get_stock_price(company_ticker: str, n_days: int, config: RunnableConfig):
    """
    Retrieves historical stock price data and daily returns for a specified company over the last n trading days.

    This tool should be used when the AI agent needs to analyze price trends, assess volatility,
    evaluate recent performance, or generate time-series visualizations. The return percentage
    enables quick assessment of daily performance changes, particularly useful for making
    buy/sell recommendations or correlating price movements with market events.

    Args:
        company_ticker (str): Official stock exchange ticker symbol (e.g., 'AAPL')
        n_days (int): Number of historical trading days to retrieve (e.g., 30 for 1 month)

    Returns:
        dict: Result object with either success or error status.
        - If success:
            {
                'status': 'success',
                'data': [
                    {
                        'date': str,          # ISO format date 'YYYY-MM-DD'
                        'company_ticker': str,
                        'stock_price': float, # Closing price for the day
                        'return': float      # Daily percentage return change
                    },
                    ...
                ]
            }
        - If error:
            {
                'status': 'error',
                'error': str  # Error message detailing failure reason
            }

        Possible errors include: invalid ticker symbol, data unavailable for timeframe,
        or API/service connectivity issues.

    Example:
        {
            'status': 'success',
            'data': [
                {'date': '2023-10-01', 'company_ticker': 'MSFT', 'stock_price': 312.05, 'return': 0.012},
                {'date': '2023-10-02', 'company_ticker': 'MSFT', 'stock_price': 308.72, 'return': -0.011}
            ]
        }
        {
            'status': 'error',
            'error': 'Invalid ticker symbol: MMMM'
        }
    """

    from src.db.database import engine
    from sqlmodel import Session

    with Session(engine) as db:


    # db = config["configurable"].get("db")
    # if not db or not isinstance(db, Session):
    #     return {
    #         "status": "error",
    #         "error": "Database not configured"
    #     }
        try:
            data = []
            with engine.connect() as conn:
                query = "select * from data_stock_price where company=:company order by \"Date\" desc limit :limit"
                res = conn.execute(text(query), {"company": company_ticker, "limit": n_days})
                for r in res:
                    data.append(serialize_data(r._asdict(), ["company", "Date", "price", "return"]))

            return {
                "status": "success",
                "data": data
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
    

toolkit = [get_user_portofolio_company, get_stock_price]