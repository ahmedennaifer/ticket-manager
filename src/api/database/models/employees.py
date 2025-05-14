"""orm model"""

from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    job = Column(String, nullable=False)
    seniority = Column(String, nullable=False)
    skills = Column(Text, nullable=False)
    tickets = Column(Integer, nullable=False)

    def __repr__(self):
        return f"<Employee(id={self.id}, name='{self.name}', job='{self.job}', seniority='{self.seniority}', skills='{self.skills}', tickets={self.tickets})>"
