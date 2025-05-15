-- schema for the table

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL, 
  job VARCHAR NOT NULL, 
  seniority VARCHAR NOT NULL, 
  skills VARCHAR NOT NULL, 
  number_of_tickets INT NOT NULL,
  current_ticket TEXT  

);
INSERT INTO employees (name, job, seniority, skills, number_of_tickets) VALUES 
('Ahmed', 'data engineer', 'mid', 'python aws spark', 1),
('Sofia', 'data engineer', 'senior', 'python aws spark', 4),
('Jamal', 'data engineer', 'junior', 'python aws spark', 2),
('Sarah', 'devops', 'senior', 'kubernetes docker aws', 3),
('Miguel', 'devops', 'mid', 'kubernetes docker aws', 5),
('Aisha', 'devops', 'junior', 'kubernetes docker aws', 1),
('Michael', 'backend', 'mid', 'java spring sql', 4),
('Elena', 'backend', 'senior', 'java spring sql', 6),
('Tyler', 'backend', 'junior', 'java spring sql', 2),
('Emma', 'data analyst', 'junior', 'sql tableau python', 2),
('Hiroshi', 'data analyst', 'senior', 'sql tableau python', 7),
('Nadia', 'data analyst', 'mid', 'sql tableau python', 3),
('Raj', 'it helpdesk', 'junior', 'windows office networking', 5),
('Lucia', 'it helpdesk', 'senior', 'windows office networking', 9),
('Darius', 'it helpdesk', 'mid', 'windows office networking', 12);

WHERE NOT EXISTS (SELECT 1 FROM employees LIMIT 1);
