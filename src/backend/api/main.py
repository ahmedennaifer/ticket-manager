"""backend server"""

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.backend.api.database.models.employees import Employee
from src.backend.api.database.db import get_db
from src.backend.assistant.pipelines.main_pipeline import run_main_pipe

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

    current_ticket: str


class EmployeeResponse(BaseModel):
    """employee res"""

    id: int
    name: str
    job: str
    seniority: str
    skills: str
    number_of_tickets: int
    current_ticket: str


@app.post("/process_ticket/", response_model=EmployeeResponse)
async def process_ticket(request: TicketRequest, db: Session = Depends(get_db)):
    """
    process a support ticket and return the employee
    """
    if not request.current_ticket:
        raise HTTPException(
            status_code=400, detail="Ticket description cannot be empty"
        )
    try:
        employees = run_main_pipe(request.current_ticket)

        least_busy = sorted(employees, key=lambda x: x.number_of_tickets)[0]

        existing_employee = (
            db.query(Employee)
            .filter_by(name=least_busy.name, job=least_busy.job)
            .first()
        )

        if existing_employee:
            existing_employee.number_of_tickets += 1
            existing_employee.current_ticket = request.current_ticket
            db.commit()

            return EmployeeResponse(
                id=existing_employee.id,
                name=existing_employee.name,
                job=existing_employee.job,
                seniority=existing_employee.seniority,
                skills=existing_employee.skills,
                number_of_tickets=existing_employee.number_of_tickets,
                current_ticket=existing_employee.current_ticket,
            )
        else:
            new_employee = Employee(
                name=least_busy.name,
                job=least_busy.job,
                seniority=least_busy.seniority,
                skills=least_busy.skills,
                number_of_tickets=least_busy.number_of_tickets + 1,
                current_ticket=request.current_ticket,
            )
            db.add(new_employee)
            db.commit()
            db.refresh(new_employee)

            return EmployeeResponse(
                id=new_employee.id,
                name=new_employee.name,
                job=new_employee.job,
                seniority=new_employee.seniority,
                skills=new_employee.skills,
                number_of_tickets=new_employee.number_of_tickets,
                current_ticket=new_employee.current_ticket,
            )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing ticket: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
