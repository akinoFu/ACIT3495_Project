create database if not exists project;
use project;
create table if not exists grades (
    name varchar(250) not null,
    subject varchar(250) not null,
    grade int not null);