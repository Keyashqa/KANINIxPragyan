from google.adk.agents import SequentialAgent
from .sub_agents.ClassificationAgent import ClassificationAgent
from .sub_agents.SpecialistCouncil import SpecialistCouncil

root_agent = SequentialAgent(
    name="RootAgent",
    sub_agents=[ClassificationAgent, SpecialistCouncil]
)
