-- schema for the table

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL, 
  job VARCHAR NOT NULL, 
  seniority VARCHAR NOT NULL, 
  skills VARCHAR NOT NULL, 
  tickets INT NOT NULL
);

INSERT INTO  employees (name, job, seniority, skills, tickets) 
SELECT 'ahmed','data engineer', 'mid', 'python aws', '1'
WHERE NOT EXISTS (SELECT 1 FROM employees LIMIT 1);
