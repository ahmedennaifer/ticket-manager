"""entrypoint for server"""

from src.api.database.db import get_db
from src.api.database.models.employees import Employee
from src.assistant.pipelines.ticket_metadata_extractor import (
    get_ticket_metadata_extractor_pipeline,
)


def main():
    """main entrypoint"""
    db = get_db()
    res = db.query(Employee).filter(Employee.tickets >= 1).first()
    print(res)
    ticket = """My Kubernetes cluster is experiencin  periodic crashes. The pods in the monitoring namespace keep restarting. Below are the relevant logs:
             [2025-05-13T14:22:18.456Z] ERROR: Pod monitorin /prometheus-operator-7b8d9c6f5-2xptz restarting too frequently
             [2025-05-13T14:22:19.123e] WARN: Memory pressure detected on node worker-2
             [2025-05-13T14:22:20.789Z] ERROR: CrashLoopBackOff: Back-off restartin  failed container
             [2025-05-13T14:23:05.321Z] ERROR: Custom resource definition synchronization failed
             [2025-05-13T14:23:07.654Z] WARN: Operator reconciliation timeout
             I'm runnin  the cert-manager and prometheus operators, and I suspect one of them might be causing resource conflicts. Can you help identify what might be causing these crashes? I've already tried increasing the resource limits but it didn't help."""
    pipe = get_ticket_metadata_extractor_pipeline()
    res = pipe.run({"ticket": ticket})
    print(res["llm"]["replies"])


if __name__ == "__main__":
    main()
