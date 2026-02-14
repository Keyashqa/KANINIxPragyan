import requests
import io
from fastapi import FastAPI, Request
from fastapi.responses import Response
from twilio.twiml.messaging_response import MessagingResponse
from pypdf import PdfReader

app = FastAPI()

@app.post("/whatsapp/callback")
async def handle_twilio_pdf(request: Request):
    form_data = await request.form()

    media_url = form_data.get("MediaUrl0")
    content_type = form_data.get("MediaContentType0")

    twilio_response = MessagingResponse()

    if media_url and content_type and "application/pdf" in content_type:
        try:
            # Download PDF from Twilio
            file_data = requests.get(media_url).content

            # Read PDF
            pdf_file = io.BytesIO(file_data)
            reader = PdfReader(pdf_file)

            print("\n--- Extracted Text from PDF ---")
            full_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    full_text += text
                    print(text)
            print("-------------------------------\n")

            # Reply to WhatsApp
            twilio_response.message(
                f"PDF received! I found {len(reader.pages)} pages. Boss."
            )

        except Exception as e:
            print(f"Error processing PDF: {e}")
            twilio_response.message(
                "Sorry, I had trouble reading that PDF."
            )
    else:
        twilio_response.message(
            "Please upload a valid PDF file."
        )

    return Response(
        content=str(twilio_response),
        media_type="application/xml"
    )
