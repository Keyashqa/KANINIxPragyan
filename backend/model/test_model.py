"""
TriageAI — Prediction Engine
Takes patient JSON input → runs XGBoost model → returns full JSON with results.
Place at: backend/model/predict.py
"""

import pickle
import pandas as pd
import json
import os
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, "model.pkl")
ENCODER_PATH = os.path.join(SCRIPT_DIR, "label_encoder.pkl")

# Column order (must match training data)
ALL_SYMPTOMS = [
    "chest_pain", "breathlessness", "headache", "fever", "cough",
    "abdominal_pain", "nausea", "vomiting", "dizziness", "fatigue",
    "palpitations", "back_pain", "joint_pain", "diarrhea", "sore_throat",
    "body_ache", "weakness", "blurred_vision", "numbness", "confusion",
    "seizures", "blood_in_stool", "weight_loss", "sweating", "swelling",
    "burning_urination", "rash", "cold", "wheezing", "loss_of_appetite"
]

ALL_CONDITIONS = [
    "diabetes", "hypertension", "asthma", "copd", "heart_disease",
    "kidney_disease", "liver_disease", "thyroid", "tuberculosis",
    "cancer", "hiv", "anemia", "obesity"
]

# Load model once
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)
with open(ENCODER_PATH, "rb") as f:
    le = pickle.load(f)


def predict(patient_json: dict) -> dict:
    """
    Takes patient input JSON, runs prediction, returns full output JSON.

    Input format:
    {
        "patient_id": "PT-2026-00125",     # optional, auto-generated if missing
        "name": "Ramanathan Iyer",          # optional
        "age": 65,
        "gender": "Male",                   # "Male" or "Female"
        "symptoms": ["chest_pain", "breathlessness", "palpitations", "sweating"],
        "bp_systolic": 175,
        "bp_diastolic": 105,
        "heart_rate": 110,
        "temperature": 98.8,
        "spo2": 93,
        "conditions": ["diabetes", "hypertension"]   # or []
    }
    """

    # --- Extract metadata ---
    patient_id = patient_json.get("patient_id", f"PT-{datetime.now().strftime('%Y-%m%d%H%M%S')}")
    name = patient_json.get("name", "Unknown")
    now = datetime.now()

    age = patient_json["age"]
    gender_str = patient_json["gender"]
    gender = 0 if gender_str.lower() == "male" else 1
    symptoms = patient_json.get("symptoms", [])
    conditions = patient_json.get("conditions", [])

    # --- Build model input ---
    model_row = {"age": age, "gender": gender}

    for s in ALL_SYMPTOMS:
        model_row[f"symptom_{s}"] = 1 if s in symptoms else 0

    model_row["bp_systolic"] = patient_json["bp_systolic"]
    model_row["bp_diastolic"] = patient_json["bp_diastolic"]
    model_row["heart_rate"] = patient_json["heart_rate"]
    model_row["temperature"] = patient_json["temperature"]
    model_row["spo2"] = patient_json["spo2"]

    for c in ALL_CONDITIONS:
        model_row[f"condition_{c}"] = 1 if c in conditions else 0

    model_row["has_pre_existing"] = 1 if len(conditions) > 0 else 0
    model_row["num_symptoms"] = len(symptoms)
    model_row["num_conditions"] = len(conditions)

    # --- Predict ---
    df = pd.DataFrame([model_row])
    risk_code = model.predict(df)[0]
    risk_label = le.inverse_transform([risk_code])[0]
    probabilities = model.predict_proba(df)[0]
    confidence = {cls: round(float(prob) * 100, 1) for cls, prob in zip(le.classes_, probabilities)}

    # --- Build output JSON ---
    output = {
        "patient_id": patient_id,
        "name": name,
        "date": now.strftime("%Y-%m-%d"),
        "time": now.strftime("%H:%M"),
        "age": age,
        "gender": gender_str,
    }

    # Symptoms as true/false
    for s in ALL_SYMPTOMS:
        output[f"symptom_{s}"] = s in symptoms

    # Vitals
    output["bp_systolic"] = patient_json["bp_systolic"]
    output["bp_diastolic"] = patient_json["bp_diastolic"]
    output["heart_rate"] = patient_json["heart_rate"]
    output["temperature"] = patient_json["temperature"]
    output["spo2"] = patient_json["spo2"]

    # Conditions as true/false
    for c in ALL_CONDITIONS:
        output[f"condition_{c}"] = c in conditions

    # Derived
    output["has_pre_existing"] = len(conditions) > 0
    output["num_symptoms"] = len(symptoms)
    output["num_conditions"] = len(conditions)

    # Result
    output["result"] = {
        "prediction": risk_label,
        "confidence": {k: f"{v}%" for k, v in confidence.items()}
    }

    return output


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    test_patients = [
        {
            "patient_id": "PT-2026-00125",
            "name": "Ramanathan Iyer",
            "age": 65,
            "gender": "Male",
            "symptoms": ["chest_pain", "breathlessness", "palpitations", "sweating"],
            "bp_systolic": 175,
            "bp_diastolic": 105,
            "heart_rate": 110,
            "temperature": 98.8,
            "spo2": 93,
            "conditions": ["diabetes", "hypertension"]
        },
        {
            "patient_id": "PT-2026-00126",
            "name": "Priya Sharma",
            "age": 28,
            "gender": "Female",
            "symptoms": ["cold", "cough", "sore_throat", "headache"],
            "bp_systolic": 115,
            "bp_diastolic": 75,
            "heart_rate": 74,
            "temperature": 99.2,
            "spo2": 98,
            "conditions": []
        },
        {
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
    ]

    print("=" * 60)
    print("🏥 TriageAI — Prediction Engine Test")
    print("=" * 60)

    for patient in test_patients:
        result = predict(patient)

        print(f"\n{'─' * 60}")
        print(f"Patient: {result['name']} ({result['patient_id']})")
        print(f"Age: {result['age']} | Gender: {result['gender']}")
        print(f"🚦 Prediction: {result['result']['prediction']}")
        print(f"📊 Confidence: {result['result']['confidence']}")
        print(f"\n📄 Full JSON Output:")
        print(json.dumps(result, indent=2))

    print(f"\n{'=' * 60}")
    print("✅ All predictions complete!")
    print("=" * 60)