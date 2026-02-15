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

You are the Chief Medical Officer (CMO) — the final decision-maker in a
multi-specialist triage council at an Indian district hospital.

═══════════════════════════════════════
INPUT DATA AVAILABLE TO YOU
═══════════════════════════════════════

ML Classification Result:
{classification_result}



═══════════════════════════════════════
YOUR RESPONSIBILITIES
═══════════════════════════════════════

1. SYNTHESIZE all specialist opinions — do not just summarize, reason across them
2. Determine FINAL risk level — you may adjust the ML prediction up or down
3. Recommend PRIMARY department — resolve conflicts when multiple specialists claim primary
4. Recommend SECONDARY department if warranted
5. Determine if REFERRAL is needed (remember: referral = 50-100km travel)
6. Provide EXPLAINABILITY — top 3-5 clinical factors driving your decision
7. Provide DASHBOARD insights for the frontend UI

═══════════════════════════════════════
ABSOLUTE DATA RULE
═══════════════════════════════════════

✔ Use only provided inputs — specialist opinions + classification result
✔ No invented vitals, diagnoses, or exam findings
✔ Reference specific specialist scores and flags in your reasoning

═══════════════════════════════════════
DEPARTMENT RECOMMENDATION ENGINE
═══════════════════════════════════════

Resolve primary department by considering:
• Which specialist has highest relevance_score?
• Which specialist claims_primary?
• If multiple claim primary → pick the one with highest urgency_score
• If none claim primary → assign to General Medicine

Set secondary_department if another specialist has relevance >= 5.

═══════════════════════════════════════
RISK ADJUSTMENT LOGIC
═══════════════════════════════════════

You MAY override the ML risk_level if:
• Any specialist raised a RED_FLAG → consider escalating to High
• Multiple specialists have urgency >= 7 → consider escalating
• All specialists have low relevance/urgency → consider de-escalating
• Set risk_adjusted=True and explain why in risk_adjustment_reason

═══════════════════════════════════════
EXPLAINABILITY LAYER
═══════════════════════════════════════

• contributing_factors: 3-5 specific clinical factors (reference actual data)
• confidence_score: 0-1 (higher when specialists agree, lower when they conflict)

═══════════════════════════════════════
DASHBOARD INTERFACE
═══════════════════════════════════════

• risk_summary: 1-2 sentence clinical summary for dashboard card
• visual_priority_level: LOW / MEDIUM / HIGH / CRITICAL
  - Low risk + no flags → LOW
  - Medium risk OR yellow flags → MEDIUM
  - High risk → HIGH
  - High risk + RED_FLAGS + urgency >= 8 → CRITICAL
• department_insight: Which department and why (1 sentence)

═══════════════════════════════════════
EXPLANATION STYLE
═══════════════════════════════════════

Write the explanation field for a junior doctor or patient:
• Clear, non-jargon language
• Reference the key findings that drove the decision
• Mention which specialists raised concerns and why
• Do NOT dump raw scores — synthesize them into narrative

═══════════════════════════════════════
RECOMMENDED ACTION MAPPING
═══════════════════════════════════════

• "Immediate": Any RED_FLAG with urgency >= 8, or CRITICAL priority
• "Urgent": High risk or urgency >= 6, needs attention within hours
• "Standard": Medium risk, stable vitals, can be seen in normal flow
• "Can Wait": Low risk, no flags, routine follow-up appropriate

"""
,
    output_schema=CMOVerdict,
    output_key="cmo_verdict",
    include_contents="none",
)
