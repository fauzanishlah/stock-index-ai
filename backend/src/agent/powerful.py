from langgraph.prebuilt import create_react_agent
from langchain_google_vertexai import ChatVertexAI
from src.agent.sub_graph.data_retrieval import tools as data_retrieval_tools
from src.agent.sub_graph.sentiment import tools as sentiment_tools
from src.agent.sub_graph.prediction import tools as prediction_tools
from src.agent import prompt
from src.core.config import settings

model = ChatVertexAI(model_name="gemini-2.0-flash", temperature=0.1, location="global", project=settings.PROJECT_ID)

graph = create_react_agent(
    model=model, 
    tools=[*data_retrieval_tools.toolkit, *sentiment_tools.toolkit, *prediction_tools.toolkit],
    prompt=prompt.POWERFUL_AGENT_PROMPT_V2
)