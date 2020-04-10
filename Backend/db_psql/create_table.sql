
DROP DATABASE IF EXISTS PMS;

CREATE DATABASE project;

\c project

DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS project CASCADE;

DROP TABLE IF EXISTS member CASCADE;

DROP TABLE IF EXISTS ProjectFiles CASCADE;

DROP TABLE IF EXISTS Task CASCADE;

DROP TABLE IF EXISTS AssignedTo CASCADE;

DROP TABLE IF EXISTS Preqtask CASCADE;

DROP TABLE IF EXISTS board CASCADE;

DROP TABLE IF EXISTS col CASCADE;

DROP TABLE IF EXISTS note CASCADE;

DROP TYPE IF EXISTS role_type;

DROP TYPE IF EXISTS status_type;

CREATE TABLE IF NOT EXISTS users (
    username text PRIMARY KEY CHECK(username ~ '^[a-z0-9_-]{3,16}$'),
    firstname text CHECK(firstname ~* '^[a-z]+$') NOT NULL,
    lastname text CHECK(lastname ~* '^[a-z]+$') NOT NULL,
    "password" TEXT CHECK ("password" ~ '(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$') NOT NULL,
    emailID text CHECK(emailID ~ '^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$') NOT NULL,
    profilepic bytea
);
-- password check -> Should have 1 lowercase letter, 1 uppercase letter, 1 number, and be at least 8 characters long
-- username check -> Alphanumeric string that may include _ and – having a length of 3 to 16 characters
-- check if path provided for profilepic is an image in the frontend or backend
-- firstname, lastname check -> case insensitive alphabetic string
/*
create user:
    insert into users values (username,firstname,lastname,password,emailID,profilepic);
    delete from users where username = '';
    update users set  password = 'helloWorld123' where username = 'arpit';
*/
CREATE TABLE IF NOT EXISTS project (
    projectid serial PRIMARY KEY,
    "name" text NOT NULL ,
    createdon date NOT NULL, -- Date Of Creation
    "path" text, -- path refers to the path of git repository
    createdby text REFERENCES users (username) ON DELETE CASCADE ON UPDATE CASCADE
);
/*
insert into project (name,DOC,createdby) values (Project1,CURRENT_DATE,'arpit');
*/

CREATE TYPE role_type as ENUM ('Leader','member');

CREATE TABLE IF NOT EXISTS member (
    member text REFERENCES users (username) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
    ProjectID int REFERENCES project (ProjectID) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
    "Role" role_type,
    PRIMARY KEY (member)
);

CREATE TABLE IF NOT EXISTS ProjectFiles (
    FileID serial PRIMARY KEY,
    "filename" text CHECK("filename" ~ '^[\w,\s-]+\.[A-Za-z]+$') NOT NULL,
    "file" bytea NOT NULL,
    lastupdated date NOT NULL,
    ProjectID int REFERENCES project (ProjectID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TYPE status_type as ENUM ('Inactive','Active','Working','Completed','Verified');
CREATE TYPE priority_type as ENUM ('Highest','High','Normal','Low')
CREATE TABLE IF NOT EXISTS Task (
    TaskID serial PRIMARY KEY,
    Title text NOT NULL,
    "Description" text,
    StartDate date,
    EndDate date,
    "Status" status_type,
    DateOfCompletion Date,
    priority priority_type,
    AssignedBy text REFERENCES users (username) ON DELETE CASCADE ON UPDATE CASCADE,
    ProjectID int REFERENCES project (ProjectID) ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK(StartDate <= EndDate)
);

CREATE TABLE IF NOT EXISTS AssignedTo (
    TaskID int REFERENCES Task (TaskID) ON DELETE CASCADE ON UPDATE CASCADE,
    member text REFERENCES users (username) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (TaskID, member)
);

CREATE TABLE IF NOT EXISTS preqtask (
    Task int REFERENCES Task (TaskID) ON DELETE CASCADE ON UPDATE CASCADE,
    Preqtask int REFERENCES Task (TaskID) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (Task, Preqtask)
);

CREATE TABLE IF NOT EXISTS board (
    boardID serial PRIMARY KEY,
    title text NOT NULL,
    "Description" text,
    "user" text REFERENCES users (username) ON DELETE CASCADE ON UPDATE CASCADE,
    ProjectID int REFERENCES project (ProjectID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Note (
    noteID serial PRIMARY KEY,
    title text NOT NULL,
    "Description" text,
    color text,
    columnID int REFERENCES board (boardID) ON DELETE CASCADE ON UPDATE CASCADE
);
