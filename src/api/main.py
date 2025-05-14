from src.api.database.db import get_db
from src.api.database.models.employees import Employee


def main():
    db = get_db()

    res = db.query(Employee).filter(Employee.tickets >= 1).first()
    if res != "":
        print(res)
    else:
        print("error")


if __name__ == "__main__":
    main()
