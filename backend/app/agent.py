from google.adk.agents import SequentialAgent
from .sub_agents.ClassificationAgent import ClassificationAgent
from .sub_agents.SpecialistCouncil import SpecialistCouncil
from .sub_agents.CMOAgent import CMOAgent

root_agent = SequentialAgent(
    name="RootAgent",
    sub_agents=[ClassificationAgent, SpecialistCouncil, CMOAgent]
)
