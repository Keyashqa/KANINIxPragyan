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
    "patient_id": "PT-TEST-002",
    "name": "Ravi Kumar",
    "age": 55,
    "gender": "Male",
    "symptoms": ["chest_pain", "sweating"],
    "bp_systolic": 160,
    "bp_diastolic": 100,
    "heart_rate": 105,
    "temperature": 98.6,
    "spo2": 96,
    "conditions": ["hypertension"]
}

# ❌ Uncomment to simulate missing input
# input_data = None


# ─────────────────────────────────────────
# Config
# ─────────────────────────────────────────

APP_NAME = "triage_app"
USER_ID = "test_user"
SESSION_ID = "debug_session"

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

    print("\n" + "=" * 60)
    print("🚀 TRIAGE AI — TEST RUNNER")
    print("=" * 60)

    # 🚨 Validate input_data FIRST
    if not input_data:
        print("\n❌ ERROR: No input_data provided")
        print("TriageAI cannot run classification.")
        print("Provide patient data in input_data.\n")
        return

    print("\n🧾 Input Patient Data:")
    print(json.dumps(input_data, indent=2))

    INITIAL_STATE = {
        "user_input": input_data
    }

    await session_service.create_session(
        app_name=APP_NAME,
        user_id=USER_ID,
        session_id=SESSION_ID,
        state=INITIAL_STATE,
    )

    print("\n🧠 Running agent pipeline...\n")

    content = types.Content(
        role="user",
        parts=[types.Part(text="START_TRIAGE")]
    )

    async for event in runner.run_async(
        user_id=USER_ID,
        session_id=SESSION_ID,
        new_message=content,
    ):

        if event.content and event.content.parts:
            text = event.content.parts[0].text

            if event.is_final_response():
                print("\n✅ FINAL AGENT RESPONSE:")
                print("-" * 60)
                print(text)
                print("-" * 60)
            else:
                print(f"[{event.author}] → {text}")

    # ✅ Fetch final session state
    session = await session_service.get_session(
        app_name=APP_NAME,
        user_id=USER_ID,
        session_id=SESSION_ID,
    )

    print("\n📦 FINAL SESSION STATE:")
    print("=" * 60)

    if session and session.state:
        print(json.dumps(session.state, indent=2, default=str))
    else:
        print("⚠️ No session state found")

    print("=" * 60 + "\n")


# ─────────────────────────────────────────

if __name__ == "__main__":
    asyncio.run(main())
