"""agent"""

from haystack.components.agents import Agent
from src.assistant.prompts.agent_prompt import agent_prompt
from src.assistant.components.base_llm import get_base_chat_llm
from src.assistant.tools.run_sql import execute_with_db_tool


def get_ticket_sorting_agent():
    return Agent(
        chat_generator=get_base_chat_llm(),
        tools=[execute_with_db_tool()],
        system_prompt=agent_prompt,
        exit_conditions=["text"],
        max_agent_steps=2,
        raise_on_tool_invocation_failure=False,
    )
