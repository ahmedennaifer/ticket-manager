"""orm model"""

from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Employee(Base):
    """employee base class"""

    __tablename__ = "employees"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    job = Column(String, nullable=False)
    seniority = Column(String, nullable=False)
    skills = Column(Text, nullable=False)
    number_of_tickets = Column(Integer, nullable=False, default=0)
    current_ticket = Column(Text, nullable=True)

    def __repr__(self):
        return f"<Employee(id={self.id}, name='{self.name}', job='{self.job}', seniority='{self.seniority}', skills='{self.skills}', tickets={self.number_of_tickets})>"
