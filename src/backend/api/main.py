from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
    ticket: str


class EmployeeResponse(BaseModel):
    id: int
    name: str
    job: str
    seniority: str
    skills: str
    tickets: int


@app.post("/process_ticket/", response_model=EmployeeResponse)
async def process_ticket(request: TicketRequest):
    """
    Process a support ticket and return the most suitable employee
    """
    if not request.ticket:
        raise HTTPException(
            status_code=400, detail="Ticket description cannot be empty"
        )

    try:
        # Call the pipeline function to process the ticket
        employee = run_main_pipe(request.ticket)

        # Convert SQLAlchemy model to Pydantic model
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
