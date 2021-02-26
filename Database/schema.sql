drop database if exists Employee_DB;
CREATE database Employee_DB;
use Employee_DB;
create table employee (
id int auto_increment primary key,
first_name varchar(30),
last_name varchar(30),
role_id int,
manager_id int);

create table role(
id int auto_increment primary key,
title varchar(30),
salary decimal,
department_id int);

create table department(
id int auto_increment primary key,
name varchar(30) );
