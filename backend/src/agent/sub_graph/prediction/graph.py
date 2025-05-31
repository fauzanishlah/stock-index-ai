from langchain_google_vertexai import ChatVertexAI
from langgraph.prebuilt import create_react_agent

from src.agent.sub_graph.prediction.tools import toolkit
from src.agent.sub_graph.prediction.prompt import PREDICTION_PROMPT
import mlflow


# mlflow.set_tracking_uri("http://localhost:5000")

mlflow.langchain.autolog()

model = ChatVertexAI(model_name="gemini-2.0-flash")


graph = create_react_agent(
    model=model,
    tools=toolkit,
    name="Prediction Agent",
    prompt=PREDICTION_PROMPT,
)

mlflow.models.set_model(graph)

