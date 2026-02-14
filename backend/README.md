# TriageAI Backend

The **TriageAI Backend** is a sophisticated multi-agent system designed to act as an AI-powered triage assistant for district hospitals. It combines traditional machine learning (XGBoost) for rapid risk stratification with a council of specialized Large Language Model (LLM) agents to provide clinical reasoning, differential diagnosis, and a final synthesized management plan.

## 🏗️ System Architecture

The backend operates as a **Sequential Agent Pipeline** orchestrated by the Google Agent Development Kit (ADK). The pipeline consists of three main stages:

### 1. Classification Agent (The "Triage Nurse")
*   **Location**: `app/sub_agents/ClassificationAgent`
*   **Type**: Pure Python Code Agent (Deterministic)
*   **Role**: Rapidly assesses patient vitals and symptoms.
*   **Mechanism**:
    *   Loads a pre-trained **XGBoost Classifier** (`model/model.pkl`) to predict risk levels (Low, Medium, High).
    *   Computes deterministic **derived metrics** like Vital Severity Score and Comorbidity Risk.
    *   **Output**: A structured `classification_result` object containing the risk profile and raw patient data.

### 2. Specialist Council (The "Medical Board")
*   **Location**: `app/sub_agents/SpecialistCouncil`
*   **Type**: Parallel Workgroup of LLM Agents
*   **Role**: Provides deep domain-specific analysis.
*   **Mechanism**:
    *   Runs **6 Specialist Agents** concurrently:
        *   🫀 **Cardiology Agent**
        *   🧠 **Neurology Agent**
        *   🫁 **Pulmonology Agent**
        *   🚑 **Emergency Medicine Agent**
        *   🩺 **General Medicine Agent**
        *   🏥 **Other Specialty Agent** (scans for 13+ other departments like Orthopedics, OB/GYN)
    *   Each agent analyzes the patient data through its specific clinical lens and outputs a structured opinion with relevance scores, urgency scores, and specific red flags.

### 3. Chief Medical Officer (CMO) Agent (The "Decision Maker")
*   **Location**: `app/sub_agents/CMOAgent`
*   **Type**: Meta-Reasoner LLM Agent
*   **Role**: **"The Final Verdict"**
*   **Mechanism**:
    *   Does **not** look at raw patient data directly.
    *   **Synthesizes** the opinions from the Specialist Council.
    *   Resolves conflicts (e.g., Cardiology says "Urgent" vs. General Medicine says "Routine").
    *   Produces the **CMOVerdict**: A production-ready, highly structured JSON output containing the final risk level, routing decision, safety alerts, and a consolidated workup plan.

## 📂 Directory Structure

```graphql
backend/
├── app/
│   ├── agent.py                # Root Agent definition (Sequential Pipeline)
│   └── sub_agents/
│       ├── ClassificationAgent/ # XGBoost integration & vital scoring
│       ├── SpecialistCouncil/   # Parallel orchestration of specialists
│       │   └── sub_agents/      # Individual specialist agent definitions
│       └── CMOAgent/            # Final synthesis & decision making logic
├── data/                       # Static data resources
├── model/                      # Machine Learning artifacts
│   ├── model.pkl               # Trained XGBoost model
│   ├── label_encoder.pkl       # Label encoder for risk classes
│   └── test_model.py           # Script to test ML predictions independently
├── main.py                     # CLI Entry point & standard Runner setup
└── requirements.txt            # Python dependencies
```

## 🚀 Getting Started

### Prerequisites

*   Python 3.10+
*   Google Cloud Project with Vertex AI enabled OR Google AI Studio API Key.

### Installation

1.  **Navigate to the backend folder**:
    ```bash
    cd backend
    ```

2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Set up Environment Variables**:
    Create a `.env` file in the `backend/` directory:
    ```env
    GOOGLE_API_KEY=your_api_key_here
    # OR for Vertex AI
    GOOGLE_CLOUD_PROJECT=your_project_id
    GOOGLE_CLOUD_LOCATION=us-central1
    ```

### Running the Application

To run the full triage pipeline with a sample patient:

```bash
python main.py
```

This will:
1.  Initialize the agents.
2.  Inject sample patient data (defined in `main.py`).
3.  Run the Classification → Specialist → CMO pipeline.
4.  Print the final **CMOVerdict** JSON to the console.

## 🧠 Model & AI Details

*   **ML Model**: XGBoost Classifier trained on a proprietary triage dataset. It predicts the base risk level.
*   **LLMs**: The system uses **Gemini 2.5 Flash** (or Pro) for the specialist and CMO agents to ensure high-reasoning capabilities with low latency.
*   **Safety**: The CMO agent implements a "Worst-Case Principle" — if *any* credible specialist raises a critical red flag, the final verdict is escalated regardless of the ML model's base prediction.

## 🛠️ Customization

*   **New Specialists**: Add a new agent in `app/sub_agents/SpecialistCouncil/sub_agents/` and register it in `SpecialistCouncil/agent.py`.
*   **Tuning the CMO**: Modify the `CMOAgent` instructions in `app/sub_agents/CMOAgent/agent.py` to adjust its risk tolerance or decision logic.
