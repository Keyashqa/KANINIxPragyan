import os
import logging
from typing import AsyncGenerator
from typing_extensions import override

from google.adk.agents import BaseAgent, LlmAgent, ParallelAgent
from google.adk.agents.invocation_context import InvocationContext
from google.adk.events import Event
from google.genai import types

from .sub_agents.CardiologyAgent import cardiology_llm_agent
from .sub_agents.NeurologyAgent import neurology_llm_agent 
from .sub_agents.GeneralMedicine import general_medicine_llm_agent
from .sub_agents.EmergencyMedicine import emergency_llm_agent
from .sub_agents.OtherSpecialityAgent import other_specialty_llm_agent
from .sub_agents.PulmonologyAgent import pulmonology_llm_agent 



logger = logging.getLogger(__name__)


class SpecialistCouncilAgent(BaseAgent):
    """
    Runs specialist medical reasoning agents in parallel.
    """

    cardiology_llm: LlmAgent
    neurology_llm: LlmAgent
    general_medicine_llm: LlmAgent
    emergency_llm: LlmAgent
    pulmonology_llm: LlmAgent
    other_specialty_llm: LlmAgent
    

    specialist_parallel: ParallelAgent

    model_config = {"arbitrary_types_allowed": True}

    def __init__(
        self,
        name: str,
        cardiology_llm: LlmAgent,
        neurology_llm: LlmAgent,
        general_medicine_llm: LlmAgent,
        emergency_llm: LlmAgent,
        pulmonology_llm: LlmAgent,
        other_specialty_llm: LlmAgent,
    ):
        # 🔹 Create Parallel Specialist Council
        specialist_parallel = ParallelAgent(
            name="SpecialistParallelAnalysis",
            sub_agents=[
                cardiology_llm,
                neurology_llm,
                general_medicine_llm,
                emergency_llm,
                pulmonology_llm,
                other_specialty_llm,
            ],
        )

        # 🔹 Register with BaseAgent
        super().__init__(
            name=name,
            cardiology_llm=cardiology_llm,
            neurology_llm=neurology_llm,
            general_medicine_llm=general_medicine_llm,
            emergency_llm=emergency_llm,
            pulmonology_llm=pulmonology_llm,
            other_specialty_llm=other_specialty_llm,
            specialist_parallel=specialist_parallel,
            sub_agents=[
                specialist_parallel,
            ],
        )

    # ─────────────────────────────────────────────
    # Main execution
    # ─────────────────────────────────────────────
    @override
    async def _run_async_impl(
        self, ctx: InvocationContext
    ) -> AsyncGenerator[Event, None]:

        classification_result = ctx.session.state.get("classification_result")

        if not classification_result:
            yield Event(
                author=self.name,
                content=types.Content(
                    role="assistant",
                    parts=[types.Part(
                        text="No classification_result found. Specialists cannot proceed."
                    )]
                )
            )
            return

        logger.info(f"[{self.name}] Running specialist council analysis")

        yield Event(
            author=self.name,
            content=types.Content(
                role="assistant",
                parts=[types.Part(
                    text="🩺 Specialist Council Activated: Cardiology + Neurology"
                )]
            )
        )

        # 🫀🧠 Run specialists in parallel
        async for event in self.specialist_parallel.run_async(ctx):
            yield event

        logger.info(f"[{self.name}] Specialist council completed")

        yield Event(
            author=self.name,
            content=types.Content(
                role="assistant",
                parts=[types.Part(
                    text="✅ Specialist Council Analysis Complete"
                )]
            )
        )


# ============================================================
# EXPORT
# ============================================================

SpecialistCouncil = SpecialistCouncilAgent(
    name="SpecialistCouncilAgent",
    cardiology_llm=cardiology_llm_agent,
    neurology_llm=neurology_llm_agent,
    general_medicine_llm=general_medicine_llm_agent,
    emergency_llm=emergency_llm_agent,
    pulmonology_llm=pulmonology_llm_agent,
    other_specialty_llm=other_specialty_llm_agent,
)
