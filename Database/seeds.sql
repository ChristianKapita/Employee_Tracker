use Employee_DB;

insert into department (name) values('Accounting');
insert into department (name) values('Research');
insert into department (name) values('Sales');
insert into department (name) values('Operations');
insert into department (name) values('Administration Board');
select * from department;


insert into role (title,salary,department_id) values ('President',6000.00,5);
insert into role (title,salary,department_id) values ('Manager Accounting',4000.00,1);
insert into role (title,salary,department_id) values ('Manager Reasearch',4500.00,2);
insert into role (title,salary,department_id) values ('Manager Sales',4300.00,3);
insert into role (title,salary,department_id) values ('Manager Operation',4000.00,4);
insert into role (title,salary,department_id) values ('Clerk',3500.00,1);
insert into role (title,salary,department_id) values ('Analyst',3300.00,2);
insert into role (title,salary,department_id) values ('Salesman',3000.00,3);


insert into employee(first_name, last_name, role_id,manager_id) values ('John','Mathew',1,Null);
insert into employee(first_name, last_name, role_id,manager_id) values ('Jim','Parker',2,1);
insert into employee(first_name, last_name, role_id,manager_id) values ('Sophia','Ran',3,1);
insert into employee(first_name, last_name, role_id,manager_id) values ('Wendi','Black',4,1);
insert into employee(first_name, last_name, role_id,manager_id) values ('Stephan','Lai',6,2);
insert into employee(first_name, last_name, role_id,manager_id) values ('Fay','Van Damme',7,3);
insert into employee(first_name, last_name, role_id,manager_id) values ('Regina','Oliveria',8,4);
