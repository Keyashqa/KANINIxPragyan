"""
TriageAI — Chief Medical Officer (CMO) Agent
Final meta-reasoning, explainability & routing agent
"""

from google.adk.agents import LlmAgent
from pydantic import BaseModel, Field
from typing import List, Literal, Optional


MODEL_NAME = "gemini-2.5-flash-lite"


# ─────────────────────────────────────────
# Specialist Summary
# ─────────────────────────────────────────

class SpecialistSummary(BaseModel):
    specialty: str
    relevance_score: float
    urgency_score: float
    confidence: Literal["HIGH", "MEDIUM", "LOW"]
    one_liner: str
    agreed_with_final: bool


# ─────────────────────────────────────────
# Explainability Layer
# ─────────────────────────────────────────

class Explainability(BaseModel):
    contributing_factors: List[str] = Field(
        description="Top clinical factors influencing final decision"
    )
    confidence_score: float = Field(
        ge=0.0,
        le=1.0,
        description="CMO confidence in verdict"
    )


# ─────────────────────────────────────────
# Dashboard Interface Data
# ─────────────────────────────────────────

class DashboardInsights(BaseModel):
    risk_summary: str
    visual_priority_level: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    department_insight: str


# ─────────────────────────────────────────
# FINAL Verdict
# ─────────────────────────────────────────

class CMOVerdict(BaseModel):
    patient_id: str
    patient_name: str

    final_risk_level: Literal["Low", "Medium", "High"]
    risk_adjusted: bool
    risk_adjustment_reason: Optional[str] = None

    # 🏥 Department Recommendation Engine
    primary_department: str
    secondary_department: Optional[str] = None

    referral_needed: bool
    referral_details: Optional[str] = None

    # 🔎 Explainability Layer
    explainability: Explainability

    # 📊 Dashboard Interface
    dashboard: DashboardInsights

    explanation: str
    recommended_action: Literal["Immediate", "Urgent", "Standard", "Can Wait"]


# ─────────────────────────────────────────
# Agent Definition
# ─────────────────────────────────────────

CMOAgent = LlmAgent(
    name="ChiefMedicalOfficer",
    model=MODEL_NAME,
    instruction="""

You are the Chief Medical Officer (CMO).

Your responsibilities:

1️⃣ Synthesize specialist opinions  
2️⃣ Determine FINAL risk level  
3️⃣ Recommend PRIMARY department  
4️⃣ Provide EXPLAINABILITY  
5️⃣ Provide DASHBOARD insights  

═══════════════════════════════════════
ABSOLUTE DATA RULE
═══════════════════════════════════════

✔ Use only provided inputs  
✔ No invented vitals or diagnoses  

═══════════════════════════════════════
DEPARTMENT RECOMMENDATION ENGINE
═══════════════════════════════════════

Decide:

• primary_department  
• secondary_department (if needed)

Based on strongest specialist relevance + urgency.

═══════════════════════════════════════
EXPLAINABILITY LAYER
═══════════════════════════════════════

Provide:

• contributing_factors (3–5 items)  
• confidence_score (0–1)

Factors must be clinically meaningful.

═══════════════════════════════════════
DASHBOARD INTERFACE
═══════════════════════════════════════

Provide:

• risk_summary (short clinical summary)  
• visual_priority_level  
• department_insight  

visual_priority_level mapping:

Low → LOW  
Medium → MEDIUM  
High → HIGH  
Critical → CRITICAL  

═══════════════════════════════════════
EXPLANATION STYLE
═══════════════════════════════════════

Explain for junior doctor / patient:

• Clear language  
• Slightly elaborate allowed  
• No score dumping  

"""
,
    output_schema=CMOVerdict,
    output_key="cmo_verdict",
    include_contents="none",
)
