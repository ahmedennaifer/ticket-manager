-- schema for the table

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL, 
  job VARCHAR NOT NULL, 
  seniority VARCHAR NOT NULL, 
  skills VARCHAR NOT NULL, 
  tickets INT NOT NULL
);

INSERT INTO employees (name, job, seniority, skills, tickets) VALUES ('Ahmed', 'data engineer', 'mid', 'python aws spark', 1), ('Sarah', 'devops', 'senior', 'kubernetes docker aws', 3), ('Michael', 'backend', 'mid', 'java spring sql', 4), ('Emma', 'data analyst', 'junior', 'sql tableau python', 2), ('Raj', 'IT Helpdesk', 'junior', 'windows office networking', 5);
WHERE NOT EXISTS (SELECT 1 FROM employees LIMIT 1);
