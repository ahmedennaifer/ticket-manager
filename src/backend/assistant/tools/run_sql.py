"""tool that lets an agents write stuff to the db"""

from typing import Any

from haystack.tools import Tool
from sqlalchemy import text
from src.backend.api.database.db import get_db

READ_FROM_DB_TOOL_PARAMS = {
    "type": "object",
    "properties": {"sql": {"type": "string"}},
    "required": ["sql"],
}


def _execute_with_db(sql) -> Any:
    """executes raw sql into the db. very bad, and unsanitized"""  # TODO: rewrite better
    lower = sql.lower()
    _session = get_db()
    hits = _session.execute(statement=text(lower)).fetchall()
    return hits


def execute_with_db_tool(tool_params: dict = READ_FROM_DB_TOOL_PARAMS) -> Tool:
    """returns a formatted Tool object"""
    return Tool(
        name="execute_with_db_tool",
        description="""This tool fetches data from the database through sql queries, \n
        you need to provide the sql according to the schema provided.
        (the table is a collection of bbc articles with this format :
                    id SERIAL PRIMARY KEY,
                    name VARCHAR NOT NULL, 
                    job VARCHAR NOT NULL, 
                    seniority VARCHAR NOT NULL, 
                    skills VARCHAR NOT NULL, 
                    number_of_tickets INT NOT NULL
                    """,
        parameters=tool_params,
        function=_execute_with_db,
    )
