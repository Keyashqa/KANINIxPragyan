import os
import json
import asyncio
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from app.agent import root_agent


# ─────────────────────────────────────────
# Environment
# ─────────────────────────────────────────

load_dotenv()

if not os.getenv("GOOGLE_API_KEY"):
    raise RuntimeError("GOOGLE_API_KEY is not set")


# ─────────────────────────────────────────
# FastAPI App
# ─────────────────────────────────────────

app = FastAPI(title="TriageAI Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────
# ADK Setup (GLOBAL)
# ─────────────────────────────────────────

APP_NAME = "triage_app"

session_service = InMemorySessionService()

runner = Runner(
    agent=root_agent,
    app_name=APP_NAME,
    session_service=session_service,
)


# ─────────────────────────────────────────
# Request Models
# ─────────────────────────────────────────

class PatientData(BaseModel):
    patient_id: Optional[str] = None
    name: Optional[str] = None
    age: int
    gender: str
    symptoms: List[str]
    bp_systolic: int
    bp_diastolic: int
    heart_rate: int
    temperature: float
    spo2: int
    conditions: List[str]


class RunRequest(BaseModel):
    user_id: str
    session_id: str
    patient_data: PatientData


# ─────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────

async def ensure_session(user_id: str, session_id: str, initial_state: Dict):
    session = await session_service.get_session(
        app_name=APP_NAME,
        user_id=user_id,
        session_id=session_id,
    )

    if session is None:
        await session_service.create_session(
            app_name=APP_NAME,
            user_id=user_id,
            session_id=session_id,
            state=initial_state,
        )
    else:
        await session_service.update_session_state(
            app_name=APP_NAME,
            user_id=user_id,
            session_id=session_id,
            state=initial_state,
        )


# ─────────────────────────────────────────
# Endpoint
# ─────────────────────────────────────────

@app.post("/run/stream")
async def run_agent_stream(req: RunRequest):

    async def event_generator():
        try:
            if not req.patient_data:
                yield f"data: {json.dumps({'error': 'Missing patient_data'})}\n\n"
                return

            # 1️⃣ Initialize session state
            initial_state = {
                "user_input": req.patient_data.model_dump()
            }

            await ensure_session(
                user_id=req.user_id,
                session_id=req.session_id,
                initial_state=initial_state,
            )

            # 2️⃣ Kickoff message
            content = types.Content(
                role="user",
                parts=[types.Part(text="START_TRIAGE")],
            )

            # 3️⃣ Stream agent events
            async for event in runner.run_async(
                user_id=req.user_id,
                session_id=req.session_id,
                new_message=content,
            ):
                payload = {
                    "author": event.author,
                    "is_final": event.is_final_response(),
                    "kind": "text",
                }

                if event.content and event.content.parts:
                    raw_text = event.content.parts[0].text
                    payload["text"] = raw_text

                    if raw_text and raw_text.strip().startswith("{"):
                        payload["kind"] = "structured"

                yield f"data: {json.dumps(payload)}\n\n"

            # 4️⃣ Fetch final verdict from session
            session = await session_service.get_session(
                app_name=APP_NAME,
                user_id=req.user_id,
                session_id=req.session_id,
            )

            verdict = session.state.get("cmo_verdict")

            if verdict:
                if hasattr(verdict, "model_dump"):
                    verdict = verdict.model_dump()

                yield f"data: {json.dumps({'kind': 'cmo_verdict', 'data': verdict, 'is_final': True})}\n\n"

            yield "data: [DONE]\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
    )


# ─────────────────────────────────────────
# Local Run
# ─────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
