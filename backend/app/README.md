# Application Logic

This directory contains the core application logic and agent definitions for TriageAI.

## Components

### `agent.py`
Defines the `RootAgent`, which is the main entry point for the ADK Runner. It orchestrates the sequential pipeline:
1.  **ClassificationAgent**
2.  **SpecialistCouncil**
3.  **CMOAgent**

### `sub_agents/`
Contains the definitions for all sub-agents.
-   **ClassificationAgent/**: XGBoost-based risk assessment.
-   **SpecialistCouncil/**: Validates and critiques the risk assessment using medical knowledge.
-   **CMOAgent/**: Synthesizes the final verdict.
