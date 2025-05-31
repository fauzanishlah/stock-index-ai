from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from src.app.agent_process import Agent
from src.agent.powerful import graph
from src.app.deps import get_db_deps, get_current_user_deps
from src.schemas.agent_schema import AgentRequest
from src.crud import chat_crud
from src.models.chat_models import ChatSession

router = APIRouter(
    prefix="/agent",
    tags=["agent"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def list_agents():
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")

@router.post("/chat")
def chat_to_agent(
    request: AgentRequest,
    db: get_db_deps, 
    user: get_current_user_deps, 
):
    agent = Agent(
        graph=graph,
        session_id=request.session_id,
        db_session=db,
        user_id=user.id
    )
    config = {
        "configurable": {
            "thread_id": request.session_id,
            "user_id": user.id,
        }
    }
    
    return StreamingResponse(
        agent.run(message=request.message, config=config),
        media_type="text/event-stream"
    )

@router.post("/test-sse")
def test_sse(
    request: AgentRequest,
    db: get_db_deps, 
    user: get_current_user_deps, 
):
    def generate_response():
        import time
        yield """event: start\ndata: {"session_id": "068352fb-6253-7e70-8000-2ab5b8de37dd", "user_id": 1, "agent": "LangGraph", "title": ""}\n\n"""
        time.sleep(1)
        yield """event: message-delta\ndata: {"message": {"content": "Hi", "additional_kwargs": {}, "response_metadata": {"safety_ratings": [], "usage_metadata": {}}, "type": "AIMessageChunk", "name": null, "id": "run--c4d99d5e-0ec9-4518-9829-5105d37b40ee", "example": false, "tool_calls": [], "invalid_tool_calls": [], "usage_metadata": null, "tool_call_chunks": []}, "langgraph_info": {"user_id": 1, "langgraph_step": 1, "langgraph_node": "agent", "langgraph_triggers": ["branch:to:agent"], "langgraph_path": ["__pregel_pull", "agent"], "langgraph_checkpoint_ns": "agent:44fffca2-f716-cc5d-25be-aba4ab19e548", "checkpoint_ns": "agent:44fffca2-f716-cc5d-25be-aba4ab19e548", "ls_provider": "google_vertexai", "ls_model_name": "gemini-2.0-flash", "ls_model_type": "chat", "ls_temperature": 0.1}, "session_id": "068352fb-6253-7e70-8000-2ab5b8de37dd"}\n\n"""
        time.sleep(1)
        yield """event: message-delta\ndata: {"message": {"content": ", how can I help you with your investment analysis today? Are you interested in analyzing a specific", "additional_kwargs": {}, "response_metadata": {"safety_ratings": [], "usage_metadata": {}}, "type": "AIMessageChunk", "name": null, "id": "run--c4d99d5e-0ec9-4518-9829-5105d37b40ee", "example": false, "tool_calls": [], "invalid_tool_calls": [], "usage_metadata": null, "tool_call_chunks": []}, "langgraph_info": {"user_id": 1, "langgraph_step": 1, "langgraph_node": "agent", "langgraph_triggers": ["branch:to:agent"], "langgraph_path": ["__pregel_pull", "agent"], "langgraph_checkpoint_ns": "agent:44fffca2-f716-cc5d-25be-aba4ab19e548", "checkpoint_ns": "agent:44fffca2-f716-cc5d-25be-aba4ab19e548", "ls_provider": "google_vertexai", "ls_model_name": "gemini-2.0-flash", "ls_model_type": "chat", "ls_temperature": 0.1}, "session_id": "068352fb-6253-7e70-8000-2ab5b8de37dd"}\n\n"""
        time.sleep(1)
        yield """event: message-delta\ndata: {"message": {"content": " stock, getting insights on your portfolio, or something else?", "additional_kwargs": {}, "response_metadata": {"safety_ratings": [], "usage_metadata": {}, "finish_reason": "STOP", "model_name": "gemini-2.0-flash"}, "type": "AIMessageChunk", "name": null, "id": "run--c4d99d5e-0ec9-4518-9829-5105d37b40ee", "example": false, "tool_calls": [], "invalid_tool_calls": [], "usage_metadata": {"input_tokens": 3398, "output_tokens": 33, "total_tokens": 3431}, "tool_call_chunks": []}, "langgraph_info": {"user_id": 1, "langgraph_step": 1, "langgraph_node": "agent", "langgraph_triggers": ["branch:to:agent"], "langgraph_path": ["__pregel_pull", "agent"], "langgraph_checkpoint_ns": "agent:44fffca2-f716-cc5d-25be-aba4ab19e548", "checkpoint_ns": "agent:44fffca2-f716-cc5d-25be-aba4ab19e548", "ls_provider": "google_vertexai", "ls_model_name": "gemini-2.0-flash", "ls_model_type": "chat", "ls_temperature": 0.1}, "session_id": "068352fb-6253-7e70-8000-2ab5b8de37dd"}\n\n"""
        time.sleep(1)
        yield """event: updates\ndata: {"id":"run--c4d99d5e-0ec9-4518-9829-5105d37b40ee","session_id":"068352fb-6253-7e70-8000-2ab5b8de37dd","content":"Hi, how can I help you with your investment analysis today? Are you interested in analyzing a specific stock, getting insights on your portfolio, or something else?","tool_call_id":null,"created_at":"2025-05-27T10:21:28.339106","deleted_at":null,"message_id":"068352fb-854c-7ef6-8000-dca78048dba0","role":"ai","tool_calls":[],"additional_kwargs":{},"updated_at":"2025-05-27T10:21:28.339687"}\n\n"""
        time.sleep(1)
        yield """event: summary\ndata: {"summary": "Investment Analysis Help"}\n\n"""
        time.sleep(1)
        yield """event: end\ndata: {"session_id": "068352fb-6253-7e70-8000-2ab5b8de37dd", "user_id": 1, "agent": "LangGraph", "title": ""}\n\n"""

    return StreamingResponse(
        generate_response(),
        media_type="text/event-stream"
    )
