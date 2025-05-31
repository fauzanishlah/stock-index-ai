from langgraph.prebuilt import create_react_agent

# from app.core.model import init_model
from langchain_google_vertexai import ChatVertexAI

from src.agent.sub_graph.data_retrieval import prompt, tools

MODEL = ChatVertexAI(model_name="gemini-2.0-flash")
graph = create_react_agent(
    model = MODEL,
    tools=tools.toolkit,
    prompt=prompt.DATA_RETRIEVAL_AGENT_PROMPT,
    name="Data Agent",
)