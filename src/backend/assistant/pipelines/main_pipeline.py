"""main pipeline that calls other pipelines"""

from typing import List

from haystack.dataclasses import ChatMessage

from src.backend.api.database.models.employees import Employee
from src.backend.assistant.agents.ticket_sorting_agent import get_ticket_sorting_agent

GREEN = "\033[1;32m"
YELLOW = "\033[1;33m"
RESET = "\033[0m"


def outputs_to_employees(output_str: str) -> list[Employee]:
    employee_strings = output_str.split("), (")
    if employee_strings:
        employee_strings[0] = employee_strings[0].lstrip("(")
        employee_strings[-1] = employee_strings[-1].rstrip(")")
    employees = []
    for emp_str in employee_strings:
        parts = [part.strip() for part in emp_str.split(",")]
        # Fix: Strip parentheses before converting to int
        id = int(parts[0].strip("()"))  # This will remove both '(' and ')'
        name = parts[1].strip().strip("'")
        job = parts[2].strip().strip("'")
        seniority = parts[3].strip().strip("'")
        skills = parts[4].strip().strip("'")
        number_of_tickets = int(parts[5].strip())
        employees.append(
            Employee(
                id=id,
                name=name,
                job=job,
                seniority=seniority,
                skills=skills,
                number_of_tickets=number_of_tickets,
            )
        )
    return employees


def run_main_pipe(ticket: str) -> List[Employee]:
    """main query that connects different pipelines and prints
    output to std"""
    agent = get_ticket_sorting_agent()
    res = agent.run(messages=[ChatMessage.from_user(ticket)])
    output = res["messages"][-1]._content[0].result.replace("[", " ").replace("]", " ")
    employees = outputs_to_employees(output)
    return employees
