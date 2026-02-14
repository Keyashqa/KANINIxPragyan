import os
import json
import uuid
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import Response
from twilio.twiml.messaging_response import MessagingResponse

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
# App Setup
# ─────────────────────────────────────────

app = FastAPI(title="TriageAI WhatsApp Webhook")

APP_NAME = "triage_app"

session_service = InMemorySessionService()

runner = Runner(
    agent=root_agent,
    app_name=APP_NAME,
    session_service=session_service,
)


# ─────────────────────────────────────────
# Session Helper
# ─────────────────────────────────────────

async def ensure_session(user_id: str, session_id: str, initial_state: dict):
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
# TRIAGE HEADER
# ─────────────────────────────────────────

def build_triage_header(classification):

    patient_name = classification.get("patient_name", "Unknown")
    risk_level = classification["prediction"]["risk_level"]
    confidence = classification["prediction"]["max_confidence"]

    risk_emoji = (
        "🟠" if risk_level == "High"
        else "🟡" if risk_level == "Medium"
        else "🟢"
    )

    header = (
        f"🏥 *Ydhya TRIAGE RESULT*\n"
        f"━━━━━━━━━━━━━━\n"
        f"👤 {patient_name}\n"
        f"{risk_emoji} Risk Level: {risk_level}\n"
        f"📊 Confidence Score: {confidence}%\n\n"
    )

    return header


# ─────────────────────────────────────────
# CMO SECTION
# ─────────────────────────────────────────

def format_cmo_section(cmo):

    final_risk = cmo["final_risk_level"]
    primary_dept = cmo.get("primary_department", "General Medicine")
    secondary_dept = cmo.get("secondary_department")
    explanation = cmo.get("explanation", "")
    recommended_action = cmo.get("recommended_action", "Standard")

    confidence = round(cmo["explainability"]["confidence_score"] * 100, 1)
    factors = cmo["explainability"].get("contributing_factors", [])

    risk_emoji = (
        "🟠" if final_risk == "High"
        else "🟡" if final_risk == "Medium"
        else "🟢"
    )

    secondary_line = ""
    if secondary_dept:
        secondary_line = f"Secondary: {secondary_dept}\n"

    factors_block = ""
    if factors:
        formatted = "\n".join([f"• {f}" for f in factors])
        factors_block = f"\n🔎 *Key Clinical Factors*\n{formatted}\n"

    referral_block = ""
    if cmo.get("referral_needed"):
        referral_details = cmo.get(
            "referral_details",
            "Higher centre evaluation advised"
        )
        referral_block = f"\n🚑 *Referral Advice*\n{referral_details}\n"

    message = (
        f"📊 *Final Clinical Verdict on Risk Level*\n"
        f"{risk_emoji} {final_risk}\n\n"

        f"🏥 *Department Recommendation*\n"
        f"Primary: {primary_dept}\n"
        f"{secondary_line}"
    )

    message += factors_block
    message += referral_block

    message += (
        f"\n📈 *CMO Confidence*\n"
        f"{confidence}%\n\n"

        f"🧾 *Clinical Explanation*\n"
        f"{explanation}\n\n"

        f"✅ *Recommended Action:* {recommended_action}\n"
    )

    message += (
        "\nℹ️ *Important:* This is an AI-assisted triage support system "
        "and does not replace a doctor's examination."
    )

    return message


# ─────────────────────────────────────────
# WhatsApp Webhook
# ─────────────────────────────────────────

@app.post("/whatsapp/callback")
async def whatsapp_callback(request: Request):

    form_data = await request.form()

    incoming_msg = form_data.get("Body")
    from_number = form_data.get("From")

    twilio_response = MessagingResponse()

    if not incoming_msg:
        twilio_response.message("Empty message received.")
        return Response(content=str(twilio_response), media_type="application/xml")

    try:
        patient_data = json.loads(incoming_msg)

        user_id = from_number
        session_id = f"{from_number}_{uuid.uuid4().hex}"

        await ensure_session(user_id, session_id, {
            "user_input": patient_data
        })

        content = types.Content(
            role="user",
            parts=[types.Part(text="START_TRIAGE")],
        )

        classification_result = None
        cmo_verdict = None

        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=content,
        ):
            if not event.content or not event.content.parts:
                continue

            text = event.content.parts[0].text.strip()

            if event.author == "ClassificationAgent" and text.startswith("{"):
                classification_result = json.loads(text)

            if event.author == "ChiefMedicalOfficer" and text.startswith("{"):
                cmo_verdict = json.loads(text)

            if classification_result and cmo_verdict:
                break

        if classification_result and cmo_verdict:

            header = build_triage_header(classification_result)
            cmo_section = format_cmo_section(cmo_verdict)

            final_message = header + cmo_section

            twilio_response.message(final_message)

        else:
            twilio_response.message("Assessment completed but incomplete.")

    except json.JSONDecodeError:
        twilio_response.message("⚠️ Send valid JSON patient data.")

    except Exception as e:
        print("Webhook Error:", e)
        twilio_response.message("❌ Error processing triage.")

    return Response(
        content=str(twilio_response),
        media_type="application/xml"
    )


# ─────────────────────────────────────────
# Local Run
# ─────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("new_server:app", host="0.0.0.0", port=5000, reload=True)
