import asyncio
import os
import json
from dotenv import load_dotenv

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
# Input Data (EDIT THIS)
# ─────────────────────────────────────────

input_data = {
    "patient_id": "PT-2026-00127",
    "name": "Lakshmi Devi",
    "age": 72,
    "gender": "Female",
    "symptoms": ["dizziness", "weakness", "fatigue", "nausea"],
    "bp_systolic": 155,
    "bp_diastolic": 95,
    "heart_rate": 95,
    "temperature": 98.4,
    "spo2": 94,
    "conditions": ["diabetes", "hypertension"]
}

# ❌ Simulate missing input
# input_data = None


# ─────────────────────────────────────────
# Config
# ─────────────────────────────────────────

APP_NAME = "triage_app"
USER_ID = "user_1"
SESSION_ID = "session_1"

session_service = InMemorySessionService()

runner = Runner(
    agent=root_agent,
    app_name=APP_NAME,
    session_service=session_service,
)


# ─────────────────────────────────────────
# Run
# ─────────────────────────────────────────

async def main():

    # 🚨 Validate input_data FIRST
    if not input_data:
        print("\n" + "=" * 60)
        print("❌ ERROR: No input_data provided")
        print("=" * 60)
        print("TriageAI cannot run classification.")
        print("Provide patient data in input_data.")
        print("=" * 60 + "\n")
        return

    INITIAL_STATE = {
        "user_input": input_data
    }

    await session_service.create_session(
        app_name=APP_NAME,
        user_id=USER_ID,
        session_id=SESSION_ID,
        state=INITIAL_STATE,
    )

    content = types.Content(
        role="user",
        parts=[types.Part(text="Start")]
    )

    async for event in runner.run_async(
        user_id=USER_ID,
        session_id=SESSION_ID,
        new_message=content,
    ):

        if event.is_final_response():
            print("\n=== FINAL RESPONSE ===")
            print(event.content.parts[0].text)

            # ✅ Fetch session PROPERLY (await required)
            session = await session_service.get_session(
                app_name=APP_NAME,
                user_id=USER_ID,
                session_id=SESSION_ID,
            )

            result = session.state.get("classification_result")

            if result:
                print("\n=== RAW classification_result ===")
                print(json.dumps(result, indent=2))


# ─────────────────────────────────────────

if __name__ == "__main__":
    asyncio.run(main())
