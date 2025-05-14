"""main pipeline that calls other pipelines"""

from haystack import Pipeline
from haystack.components.builders.chat_prompt_builder import ChatPromptBuilder
from haystack.dataclasses import ChatMessage


from src.assistant.agents.ticket_sorting_agent import get_ticket_sorting_agent
from src.api.database.models.employees import Employee


GREEN = "\033[1;32m"
YELLOW = "\033[1;33m"
RESET = "\033[0m"


def output_to_employee(output_str: str) -> Employee:
    output_str_trimmed = output_str.strip()[1:-1]
    parts = [part.strip() for part in output_str_trimmed.split(",")]
    id = parts[0].strip()
    name = parts[1].strip().strip("'")
    job = parts[2].strip().strip("'")
    seniority = parts[3].strip().strip("'")
    skills = parts[4].strip().strip("'")
    tickets = parts[5].strip()
    return Employee(
        id=id, name=name, job=job, seniority=seniority, skills=skills, tickets=tickets
    )


def run_main_pipe(ticket: str) -> Employee:
    """main query that connects different pipelines and prints
    output to std"""
    agent = get_ticket_sorting_agent()
    res = agent.run(messages=[ChatMessage.from_user(ticket)])
    output = res["messages"][-1]._content[0].result.replace("[", " ").replace("]", " ")
    employee = output_to_employee(output)
    return employee
