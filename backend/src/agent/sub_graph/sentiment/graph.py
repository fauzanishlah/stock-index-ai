from langgraph.prebuilt import create_react_agent
from langchain_google_vertexai import ChatVertexAI

from src.agent.sub_graph.sentiment.tools import toolkit
from src.agent.sub_graph.sentiment.prompt import SENTIMENT_ANALYST_PROMPT

model = ChatVertexAI(model_name="gemini-2.0-flash")

graph = create_react_agent(
    model=model,
    name="Sentiment Analyst Agent",
    tools=toolkit,
    prompt=SENTIMENT_ANALYST_PROMPT
) 