DROP DATABASE IF EXISTS pms;

CREATE DATABASE pms;

\c pms

DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS project CASCADE;

DROP TABLE IF EXISTS member CASCADE;

DROP TABLE IF EXISTS projectfiles CASCADE;

DROP TABLE IF EXISTS task CASCADE;

DROP TABLE IF EXISTS assignedto CASCADE;

DROP TABLE IF EXISTS preqtask CASCADE;

DROP TABLE IF EXISTS board CASCADE;

-- DROP TABLE IF EXISTS col CASCADE;
DROP TABLE IF EXISTS note CASCADE;

DROP TYPE IF EXISTS role_type;

DROP TYPE IF EXISTS status_type;

DROP TYPE IF EXISTS priority_type;

-- username check -> Alphanumeric string that may include _ and – having a length of 3 to 16 characters
-- check if path provided for profilepic is an image in the frontend or backend
-- firstname, lastname check -> case insensitive alphabetic string

CREATE TABLE IF NOT EXISTS users (
    username text
        CHECK(username ~ '^[a-z0-9_-]{3,16}$') PRIMARY KEY,
    firstname text
        CHECK(firstname ~* '^[a-z]+$') NOT NULL,
    lastname text
        CHECK(lastname ~* '^[a-z]+$') NOT NULL,
    "password" text NOT NULL,
    emailid text
        UNIQUE CHECK(emailid ~ '^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$') NOT NULL,
    profilepic bytea
);


/*
insert into users values('username','fn','ln','pswd','email',null);
 */
CREATE TABLE IF NOT EXISTS project (
    projectid serial PRIMARY KEY,
    "name" text NOT NULL,
    createdon date NOT NULL, -- Date Of Creation
    "path" text, -- path refers to the path of git repository
    createdby text
        REFERENCES users (username) ON DELETE CASCADE
);


/*
insert into project (name,createdon,createdby) values ('Project1',CURRENT_DATE,'arpit');
 */
CREATE TYPE role_type AS ENUM (
    'leader',
    'member'
);

CREATE TABLE IF NOT EXISTS member (
    username text PRIMARY KEY
        REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
    projectid int
        REFERENCES project ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
    "role" role_type,
    PRIMARY KEY (username, projectid)
);


/*
insert into member where values ('un',pid,role)
 */
CREATE TABLE IF NOT EXISTS projectfiles (
    fileid serial PRIMARY KEY,
    "filename" text
        CHECK ("filename" ~ '^[\w,\s-]+\.[A-Za-z]+$') NOT NULL,
    "file" bytea NOT NULL,
    lastupdated date NOT NULL,
    projectid int
        REFERENCES project ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TYPE status_type AS ENUM (
    'inactive',
    'active',
    'working',
    'completed',
    'verified'
);

CREATE TYPE priority_type AS ENUM (
    'highest',
    'high',
    'normal',
    'low'
);

CREATE TABLE IF NOT EXISTS task (
    taskid serial PRIMARY KEY,
    title text NOT NULL,
    description text,
    starttime timestamp DEFAULT NOW() CHECK (starttime <= endtime),
    endtime timestamp,
    status status_type DEFAULT 'active',
    completiontime timestamp CHECK (starttime <= completiontime),
    priority priority_type DEFAULT 'normal',
    assignedby text,
    projectid int,
    FOREIGN KEY (assignedby, projectid)
        REFERENCES member (username, projectid) ON DELETE CASCADE ON UPDATE CASCADE
);


/*
insert into task (title,description,starttime,endtime,assignedby,projectid)
values('task1','just a task',null,null,'arpit',1);
 */
CREATE TABLE IF NOT EXISTS assignedto (
    taskid int
        REFERENCES task ON DELETE CASCADE ON UPDATE CASCADE,
    username text
        REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (taskid, username)
);

CREATE TABLE IF NOT EXISTS preqtask (
    task int
        REFERENCES task (taskid) ON DELETE CASCADE ON UPDATE CASCADE,
    preqtask int
        REFERENCES task (taskid) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (task, preqtask)
);

CREATE TABLE IF NOT EXISTS board (
    boardid serial PRIMARY KEY,
    title text NOT NULL,
    "description" text,
    username text
        REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
    projectid int
        REFERENCES project ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS note (
    noteid serial PRIMARY KEY,
    title text NOT NULL,
    "description" text,
    color text,
    columnid int REFERENCES board (boardid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- PL-Blocks
--#1 trigger to encrypt password before saving into db

CREATE EXTENSION pgcrypto;

CREATE OR REPLACE FUNCTION create_hash ()
    RETURNS TRIGGER
    AS $create_hash$
BEGIN
    --
    -- Store passwords securely
    -- password should have 1 lowercase letter, 1 uppercase letter, 1 number, and be 8 to 72 characters long
    --
    IF NEW.password !~ '(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,72}$' THEN
        RAISE EXCEPTION 'Please enter a strong password';
    ELSE
        NEW.password = crypt(NEW.password, gen_salt('bf'));
    END IF;
    RETURN NEW;
END;
$create_hash$
LANGUAGE plpgsql;

CREATE TRIGGER create_hash
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_hash (PASSWORD);

--#2 trigger to add the user who created the project as a member
CREATE OR REPLACE FUNCTION add_leader()
    RETURNS TRIGGER
    AS $add_leader$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO member
            VALUES (NEW.createdby, NEW.projectid, 'leader');
    ELSE
        DELETE FROM member
        WHERE projectid = OLD.projectid;
    END IF;
    RETURN NEW;
END
$add_leader$ LANGUAGE plpgsql;

CREATE TRIGGER add_leader AFTER INSERT OR DELETE ON project
    FOR EACH ROW EXECUTE FUNCTION add_leader();

-- #3 trigger only leader can assign task
CREATE OR REPLACE FUNCTION add_task()
    RETURNS TRIGGER
    AS $add_task$
DECLARE
    myrole role_type;
BEGIN
    SELECT "role" INTO myrole
    FROM member
    WHERE username = NEW.assignedby AND projectid = NEW.projectid;

    IF myrole = 'leader' THEN
        RETURN NEW;
    ELSE
        RAISE EXCEPTION 'member is not a leader';
        RETURN NULL;
    END IF;
END
$add_task$ LANGUAGE plpgsql;

CREATE TRIGGER add_task BEFORE INSERT OR UPDATE ON task
    FOR EACH ROW EXECUTE PROCEDURE add_task();

-- #4 procedure assigned to is a member
CREATE PROCEDURE assigntask (
    taskid int, username text
) AS $$
    DECLARE
        b boolean;
    BEGIN
        SELECT
    END;
$$
LANGUAGE plpgsql;

-- #5 trigger update status of task(to active) when prereq task is completed
