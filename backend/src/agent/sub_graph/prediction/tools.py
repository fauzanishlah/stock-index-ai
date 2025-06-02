from typing import Dict, Any
from langchain_core.tools import tool
from src.agent.sub_graph.prediction.helper import predict
import pandas as pd

from typing import List, Dict
from langchain.schema import HumanMessage, SystemMessage
from langchain_google_vertexai import ChatVertexAI
from langchain_google_genai import ChatGoogleGenerativeAI

from src.core.config import settings




@tool("forecast_stock_returns", parse_docstring=True)
def forecast_stock_returns(ticker: str, sentiment_score: float, n_days: int) -> Dict[str, Any]:
    """Forecasts daily stock returns using an LSTM model incorporating market sentiment scores.

    This tool should be used when the AI agent needs to generate forward-looking investment insights 
    that combine quantitative modeling with qualitative sentiment analysis. Particularly valuable for:
    - Creating sentiment-aware price movement predictions
    - Evaluating how news-driven sentiment might impact short-term returns
    - Generating time-sensitive trade signals for portfolio rebalancing
    - The forecast returns are in percentage, the value range between -100 to 100

    Args:
        ticker (str): IDX Company stock symbol  (e.g., 'TLKM')
        sentiment_score (float): Market sentiment input (-1.0 to 1.0) from news/headlines analysis
        n_days (int): Number of consecutive days to forecast (e.g., 7 for weekly outlook)

    Returns:
        dict: Result object with either success or error status.
        - If success:
            {
                'status': 'success',
                'data': [
                    {
                        'day': int,       # Days from current date (1 = tomorrow)
                        'return': float,  # Forecasted daily return percentage
                        'ticker': str
                    },
                    ...
                ]
            }
        - If error:
            {
                'status': 'error',
                'error': str  # Error message detailing failure reason
            }

        Possible errors include: invalid ticker, out-of-range sentiment score,
        model loading failure, or insufficient historical data.

    Example:
        {
            'status': 'success',
            'data': [
                {'day': 1, 'return': 0.015, 'ticker': 'TSLA'},
                {'day': 2, 'return': -0.008, 'ticker': 'TSLA'}
            ]
        }
        {
            'status': 'error', 
            'error': 'Sentiment score out of range (-1.0-1.0): 1.2'
        }
    """
    try:
        predict_data: pd.DataFrame = predict(ticker, sentiment_score, n_days)
        return {
            'status': 'success',
            'data': predict_data.to_dict('records')
        }
    except Exception as e:
        return {
            'status': 'error',
            'error': str(e)
        }
    

@tool("analyze_stock_trends", parse_docstring=True)
def analyze_stock_trends(
    ticker: str,
    historical_data: List[Dict],
    forecast_data: List[Dict],
    sentiment_score: float
) -> Dict:
    """
    Generates stock investment recommendation using historical data, forecasts, and sentiment analysis.
    
    This tool should be used when the AI agent needs to make final investment decisions by synthesizing
    quantitative trends, predictive models, and qualitative market sentiment. Combines multiple data
    sources to provide explainable recommendations aligned with typical investor decision-making frameworks.

    Args:
        ticker (str): IDX Company stock symbol (e.g., 'TLKM')
        historical_data: List of historical price records (min 10 days), [{"date": "2023-01-01", "company": "BBCA", "return": 0.12345, "price": 1234.56}]
        forecast_data: List of predicted returns (min 1 day), [{"date": "2023-01-02", "company": "BBCA", "return": 0.12345, "sentiment": 0.12}]
        sentiment_score: Market sentiment (-1 to 1)

    Returns:
        dict: Result object with recommendation and reasoning
        - If success:
            {
                'status': 'success',
                'data': {
                    'recommendation': str,  # 'buy', 'hold', or 'sell'
                    'reason': str           # Natural language explanation
                }
            }
        - If error:
            {'status': 'error', 'error': str}

    Example:
        {
            'status': 'success',
            'data': {
                'recommendation': 'buy',
                'reason': "Strong positive trend (+5% last week) with bullish forecasts..."
            }
        }
    """
    try:
        # Input validation
        if len(historical_data) < 10:
            return {'status': 'error', 'error': 'Insufficient historical data (min 10 days required)'}
        if len(forecast_data) < 1:
            return {'status': 'error', 'error': 'No forecast data available'}
        if not (-1 <= sentiment_score <= 1):
            return {'status': 'error', 'error': f'Invalid sentiment score: {sentiment_score}'}

        # Prepare analysis components
        # ticker = forecast_data[0]['ticker']
        analysis = {
            'price_trend': _calculate_price_trend(historical_data),
            # 'recent_volatility': _calculate_volatility(historical_data[-5:]),
            'forecast_trend': _calculate_forecast_trend(forecast_data),
            'sentiment_strength': _categorize_sentiment(sentiment_score),
            # 'key_levels': _identify_key_levels(historical_data)
        }

        # Generate recommendation using Gemini
        # model = ChatVertexAI(model_name="gemini-2.0-flash", temperature=0.2)
        model = ChatGoogleGenerativeAI(model=settings.AGENT_MODEL, temperature=0.2)
        prompt = _build_recommendation_prompt(ticker, analysis, sentiment_score)
        response = model.invoke(prompt)
        response = response.content

        return {
            'status': 'success',
            'data': response
        }

    except Exception as e:
        return {'status': 'error', 'error': f'Analysis failed: {str(e)}'}

# Helper functions ---------------------------------------------------

def _calculate_price_trend(data: List[Dict]) -> Dict:
    """Calculate short/long-term price trends"""
    short_term = data[-3:]
    long_term = data[-10:]
    return {
        '3_day_change': sum([float(d['return']) for d in short_term]),
        '10_day_change': sum([float(d['return']) for d in long_term])
    }

def _calculate_forecast_trend(forecasts: List[Dict]) -> Dict:
    """Analyze forecast trajectory"""
    return {
        'next_day': float(forecasts[0]['return']),
        'average_forecast': sum(float(f['return']) for f in forecasts) / len(forecasts)
    }

def _categorize_sentiment(score: float) -> str:
    """Convert numerical sentiment to categorical"""
    if score > 0.6: return 'strong_bullish'
    if score > 0.2: return 'bullish'
    if score < -0.6: return 'strong_bearish'
    if score < -0.2: return 'bearish'
    return 'neutral'

def _build_recommendation_prompt(ticker: str, analysis: Dict, sentiment: float) -> List:
    """Construct structured prompt for Gemini"""
    return [
        SystemMessage(content="You are a professional stock analyst. Consider these factors:"),
        HumanMessage(content=f"""
            Company: {ticker}
            Price Trends:
            - 3-day return: {analysis['price_trend']['3_day_change']:.2%}
            - 10-day return: {analysis['price_trend']['10_day_change']:.2%}
            
            Forecasts:
            - Next day: {analysis['forecast_trend']['next_day']:.2%}
            - Average forecast: {analysis['forecast_trend']['average_forecast']:.2%}
            
            Market Sentiment: {analysis['sentiment_strength']} ({sentiment:.2f})
            
            Provide recommendation and concise reasoning using ONLY this format:
            Recommendation: [buy/hold/sell]
            Reason: [2-3 sentence explanation considering trends, forecasts, and sentiment]
        """)
    ]

# def _parse_recommendation(response: str) -> Dict:
#     """Extract structured recommendation from Gemini response"""
#     lines = [line.strip() for line in response.split('\n')]
#     rec = reason = ''
    
#     for line in lines:
#         if line.lower().startswith('recommendation:'):
#             rec = line.split(':')[1].strip().lower()
#         elif line.lower().startswith('reason:'):
#             reason = ':'.join(line.split(':')[1:]).strip()
    
#     if rec not in ['buy', 'hold', 'sell']:
#         raise ValueError("Invalid recommendation format")
    
#     return {'recommendation': rec, 'reason': reason}

toolkit = [forecast_stock_returns, analyze_stock_trends]