import json
from typing import Union
from uuid import UUID

from sqlmodel import Session
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langgraph.graph.state import CompiledStateGraph

from src.models.chat_models import ChatSession
from src.crud import chat_crud
from src.models.helper import from_langchain_message
from src.models.chat_models import ChatMessage
from src.app.utils import UUIDEncoder, generate_summary_text

class Agent:
    def __init__(self, graph: CompiledStateGraph, session_id: UUID, db_session: Session, user_id: int):
        self.graph: CompiledStateGraph = graph
        self.session_id = session_id
        self.db_session = db_session
        self.user_id = user_id
        self.tool_calls: dict = {}
        self._init_chat_session()
        self._init_chat_messages()

    def _init_chat_session(self):
        self.first_chat = True
        chat_session = ChatSession(
            id=self.session_id,
            user_id=self.user_id,
            agent=self.graph.name,
            title=""
        )
        _check = chat_crud.get_chat_session_by_id(
            db=self.db_session,
            session_id=self.session_id
        )
        if not _check:
            self.chat_session = chat_crud.create_chat_session(
                db=self.db_session,
                chat_session=chat_session
            )
        else:
            self.chat_session = _check
            self.first_chat = False
            chat_crud.update_chat_session_timestamp(db=self.db_session, session_id=self.session_id)
        
    
    def _init_chat_messages(self):
        self.chat_messages = chat_crud.get_chat_messages_by_session_id(
            db=self.db_session,
            session_id=self.session_id
        )

    def tool_record_handler(self, message: Union[AIMessage, ToolMessage]):
        if isinstance(message, AIMessage):
            for tool_call in message.tool_calls:
                dict_value = {
                    "args": tool_call
                }
                self_tool_call = self.tool_calls.get(tool_call.get('id', ''), {})
                self_tool_call.update(dict_value)
                self.tool_calls[tool_call.get('id', '')] = self_tool_call
            
        elif isinstance(message, ToolMessage):
            dict_value = {
                "response": message.model_dump(mode="python")
            }
            self_tool_call =  self.tool_calls.get(message.tool_call_id, {})
            self_tool_call.update(dict_value)
            
            if message.tool_call_id:
                self.tool_calls[message.tool_call_id] = self_tool_call

                message_additional_kwargs = message.additional_kwargs
                message_additional_kwargs.update(self.tool_calls[message.tool_call_id])
                message.additional_kwargs = message_additional_kwargs
            
        return message


    def updates_handler(self, data: dict):
        for value in data.values():
            messages = value.get("messages", [])
            for message in messages:
                message = self.tool_record_handler(message=message)
                chat_message = from_langchain_message(message=message, session_id=self.session_id)
                self.chat_messages.append(chat_message)
                chat_crud.add_chat_message(
                    db = self.db_session,
                    chat_message=chat_message,
                )
                yield f"event: updates\ndata: {chat_message.model_dump_json()}\n\n"
    
    def messages_handler(self, data: tuple):
        message = data[0]
        langgraph_info = data[1]
        data = {
            "message": message.model_dump(mode="json"),
            "langgraph_info": langgraph_info,
            "session_id": self.session_id
        }
        yield f"event: message-delta\ndata: {json.dumps(data, cls=UUIDEncoder)}\n\n"

    def summary_handler(self):
        summary_text = generate_summary_text(
            db=self.db_session,
            session_id=self.session_id
        )
        return f"event: summary\ndata: {json.dumps({'summary': summary_text})}\n\n"

    def run(self, message: Union[str, HumanMessage], config: dict):
        input_messages = [m.to_langchain_message() for m in self.chat_messages]
        if isinstance(message, str):
            input = {"messages": input_messages + [HumanMessage(message)]}
            langchain_human_message = HumanMessage(message)
        elif isinstance(message, HumanMessage):
            input = {"messages": input_messages + [message]}
            langchain_human_message = message
        else:
            raise TypeError("Message must be a string or HumanMessage instance")
        
        chat_crud.add_chat_message(
            db=self.db_session,
            chat_message=from_langchain_message(
                message=langchain_human_message,
                session_id=self.session_id
            )
        )
        session_data = {
            "session_id": str(self.session_id),
            "user_id": self.user_id,
            "agent": self.graph.name,
            "title": self.chat_session.title
        }
        yield f"event: start\ndata: {json.dumps(session_data)}\n\n"

            
        for mode, data in self.graph.stream(
            input=input,
            config=config,
            stream_mode=["updates", "messages"]
        ):
            if mode == "updates":
                for v in self.updates_handler(data):
                    yield v
            elif mode == "messages":
                for v in self.messages_handler(data):
                    yield v
        
        if self.first_chat:
            yield self.summary_handler()
        yield f"event: end\ndata: {json.dumps(session_data)}\n\n"
            