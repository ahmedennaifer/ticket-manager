"""backend server"""

from typing import Any
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.backend.api.database.models.employees import Employee
from src.backend.assistant.pipelines.main_pipeline import run_main_pipe
from src.backend.api.database.db import get_db


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TicketRequest(BaseModel):
    """ticket req"""

    ticket: str


class EmployeeResponse(BaseModel):
    """employee res"""

    id: int
    name: str
    job: str
    seniority: str
    skills: str
    tickets: int


class AssignTicketRequest(BaseModel):
    """assign ticket res"""

    id: int
    name: str


class AssignTicketResponse(BaseModel):
    """assign ticket response"""

    is_assigned: bool
    ticket_count: int | Any


@app.post("/assign_ticket/", response_model=AssignTicketResponse)
async def assign_ticket(request: AssignTicketRequest, db: Session = Depends(get_db)):
    """endpoint for assigning ticket"""
    user_id = request.id
    user_name = request.name
    try:
        employee = (
            db.query(Employee)
            .filter(Employee.id == user_id and Employee.name == user_name)
            .first()
        )
        if employee:
            try:
                employee.tickets += 1
                db.add(employee)
                db.commit()
                return AssignTicketResponse(
                    is_assigned=True, ticket_count=employee.tickets
                )
            except Exception as e:
                raise e
    except Exception as e:
        raise e


@app.post("/process_ticket/", response_model=EmployeeResponse)
async def process_ticket(request: TicketRequest):
    """
    process a support ticket and return the employee
    """
    if not request.ticket:
        raise HTTPException(
            status_code=400, detail="Ticket description cannot be empty"
        )

    try:
        employee = run_main_pipe(request.ticket)

        return EmployeeResponse(
            id=employee.id,
            name=employee.name,
            job=employee.job,
            seniority=employee.seniority,
            skills=employee.skills,
            tickets=employee.tickets,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing ticket: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
