from langgraph_supervisor import create_supervisor
from langchain_google_vertexai import ChatVertexAI
from src.agent.sub_graph.sentiment.graph import graph as sentiment_agent
from src.agent.sub_graph.data_retrieval.graph import graph as data_retrieval_agent
from src.agent.sub_graph.prediction.graph import graph as prediction_agent


from src.agent.prompt import SUPERVISOR_PROMPT


model = ChatVertexAI(model_name="gemini-2.0-flash", temperature = 0)
graph = create_supervisor(
    model=model,
    agents=[sentiment_agent, data_retrieval_agent, prediction_agent],
    prompt=SUPERVISOR_PROMPT,
    parallel_tool_calls=True
)