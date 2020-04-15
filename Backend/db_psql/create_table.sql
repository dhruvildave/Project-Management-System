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
    username text CHECK (username ~ '^[a-z0-9_-]{3,16}$') PRIMARY KEY,
    firstname text CHECK (firstname ~* '^[a-z]+$') NOT NULL,
    lastname text CHECK (lastname ~* '^[a-z]+$') NOT NULL,
    "password" text NOT NULL,
    emailid text UNIQUE CHECK (emailid ~ '^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$') NOT NULL,
    profilepic bytea
);


/*
insert into users values('username','fn','ln','pswd','email',null);
 */
CREATE TABLE IF NOT EXISTS project (
    projectid serial PRIMARY KEY,
    "name" text NOT NULL,
    "shortdescription" text,
    "longdescription" text,
    createdon date NOT NULL, -- Date Of Creation
    "path" text, -- path refers to the path of git repository
    createdby text REFERENCES users (username) ON DELETE CASCADE
);


/*
insert into project (name,createdon,createdby) values ('Project1',CURRENT_DATE,'arpit');
 */
CREATE TYPE role_type AS ENUM (
    'leader',
    'member'
);

CREATE TABLE IF NOT EXISTS member (
    username text REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
    projectid int REFERENCES project ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
    "role" role_type,
    PRIMARY KEY (username, projectid)
);


/*
insert into member where values ('un',pid,role)
 */
CREATE TABLE IF NOT EXISTS projectfiles (
    fileid serial PRIMARY KEY,
    "filename" text CHECK ("filename" ~ '^[\w,\s-]+\.[A-Za-z]+$') NOT NULL,
    "file" bytea NOT NULL,
    lastupdated date NOT NULL,
    projectid int REFERENCES project ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TYPE status_type AS ENUM (
    'inactive',
    'active',
    'working',
    'completed'
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
    assignedby text NOT NULL,
    projectid int NOT NULL,
    FOREIGN KEY (assignedby, projectid)
        REFERENCES member (username, projectid) ON DELETE CASCADE ON UPDATE CASCADE
);


/*
insert into task (title,description,starttime,endtime,assignedby,projectid)
values('task1','just a task',null,null,'arpit',1);
 */
CREATE TABLE IF NOT EXISTS assignedto (
    taskid int REFERENCES task ON DELETE CASCADE ON UPDATE CASCADE,
    username text REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (taskid, username)
);

CREATE TABLE IF NOT EXISTS preqtask (
    task int REFERENCES task (taskid) ON DELETE CASCADE ON UPDATE CASCADE,
    preqtask int REFERENCES task (taskid) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (task, preqtask)
);

CREATE TABLE IF NOT EXISTS board (
    boardid serial PRIMARY KEY,
    title text NOT NULL,
    "description" text,
    username text REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
    projectid int REFERENCES project ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS note (
    noteid serial PRIMARY KEY,
    title text NOT NULL,
    "description" text,
    color text,
    createdby text REFERENCES users (username) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
    createdat timestamp DEFAULT NOW() NOT NULL,
    boardid int REFERENCES board (boardid) ON DELETE CASCADE ON UPDATE CASCADE
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
    EXECUTE FUNCTION create_hash ();

--#2 trigger=> to add the user who created the project as a member
CREATE OR REPLACE FUNCTION add_leader ()
    RETURNS TRIGGER
    AS $add_leader$
BEGIN
    INSERT INTO member
        VALUES (NEW.createdby, NEW.projectid, 'leader');
    RETURN NEW;
END
$add_leader$
LANGUAGE plpgsql;

CREATE TRIGGER add_leader
    AFTER INSERT ON project
    FOR EACH ROW
    EXECUTE FUNCTION add_leader ();

-- #3 trigger only leader can assign task
CREATE OR REPLACE FUNCTION add_task ()
    RETURNS TRIGGER
    AS $add_task$
DECLARE
    myrole role_type;
BEGIN
    SELECT
        "role" INTO myrole
    FROM
        member
    WHERE
        username = NEW.assignedby
        AND projectid = NEW.projectid;
    IF myrole = 'leader' THEN
        RETURN NEW;
    ELSE
        RAISE EXCEPTION 'member is not a leader';
        RETURN NULL;
    END IF;
END
$add_task$
LANGUAGE plpgsql;

CREATE TRIGGER add_task
    BEFORE INSERT OR UPDATE ON task
    FOR EACH ROW
    EXECUTE PROCEDURE add_task ();

-- #4 procedure assigned to is a member
CREATE PROCEDURE assigntask (tid int, un text
)
    AS $$
DECLARE
BEGIN
    IF EXISTS (
        SELECT
            username
        FROM
            member
        WHERE
            projectid = (
                SELECT
                    projectid
                FROM
                    task
                WHERE
                    taskid = tid)
                AND username = un) THEN
        INSERT INTO assignedto
            VALUES (tid, un);
ELSE
    RAISE EXCEPTION 'user is not a member of the project';
END IF;
END
$$
LANGUAGE plpgsql;

-- #5 trigger update status of task(to active) when prereq task is completed
CREATE OR REPLACE FUNCTION update_status ()
    RETURNS TRIGGER
    AS $$
DECLARE
    r int;
    cur1 CURSOR (tid int)
    FOR
        SELECT
            task AS t
        FROM
            preqtask
        WHERE
            preqtask = tid;
    BEGIN
        IF NEW.status = 'completed' THEN
            FOR r IN cur1 (NEW.taskid)
            LOOP
                IF NOT EXISTS (
                    SELECT
                        status
                    FROM
                        task
                    WHERE
                        taskid IN (
                            SELECT
                                preqtask
                            FROM
                                preqtask
                            WHERE
                                task = r.t)
                            AND (status != 'completed')) THEN
                    UPDATE
                        task
                    SET
                        status = 'active'
                    WHERE
                        taskid = r.t;
            END IF;
        END LOOP;
    END IF;
            RETURN NEW;
END
$$
LANGUAGE plpgsql;

CREATE TRIGGER update_status
    AFTER UPDATE ON task
    FOR EACH ROW
    EXECUTE FUNCTION update_status ();

-- #6 procedure => add preqtask and set task status to inactive
CREATE PROCEDURE add_preqtask (taskid int, preqid int
)
    AS $$
BEGIN
    INSERT INTO preqtask
        VALUES (taskid, preqid);
    UPDATE
        task
    SET
        status = 'inactive'
    WHERE
        task = taskid;
END
$$
LANGUAGE plpgsql;

-- #7 procedure => delete project only if the user doing it is a leader
CREATE PROCEDURE delete_project (usr text, pid int
)
    AS $$
DECLARE
    userrole text;
BEGIN
    SELECT
        ROLE INTO userrole
    FROM
        member
    WHERE
        username = usr
        AND projectid = pid;
    IF userrole = 'leader' THEN
        DELETE FROM project
        WHERE projectid = pid;
    ELSE
        RAISE EXCEPTION 'user is not a leader';
    END IF;
END
$$
LANGUAGE plpgsql;

-- #8 procedure => change project name if the user is a leader
CREATE PROCEDURE change_projectname (usr text, newname text, pid int
)
    AS $$
DECLARE
    userrole text;
BEGIN
    SELECT
        ROLE INTO userrole
    FROM
        member
    WHERE
        username = usr
        AND projectid = pid;
    IF userrole = 'leader' THEN
        UPDATE
            project
        SET
            name = newname
        WHERE
            projectid = pid;
    ELSE
        RAISE EXCEPTION 'user is not a leader';
    END IF;
END
$$
LANGUAGE plpgsql;

CREATE PROCEDURE change_projectpath (usr text, newpath text, pid int
)
    AS $$
DECLARE
    userrole text;
BEGIN
    SELECT
        ROLE INTO userrole
    FROM
        member
    WHERE
        username = usr
        AND projectid = pid;
    IF userrole = 'leader' THEN
        UPDATE
            project
        SET
            path = newpath
        WHERE
            projectid = pid;
    ELSE
        RAISE EXCEPTION 'user is not a leader';
    END IF;
END
$$
LANGUAGE plpgsql;

-- #9 procedure -> add array of members only if all of them are a user
CREATE OR REPLACE PROCEDURE add_members (usr text, members text[], pid int
)
    AS $$
DECLARE
    mem text;
BEGIN
    FOREACH mem IN ARRAY members LOOP
        IF NOT EXISTS (
            SELECT
                1
            FROM
                users
            WHERE
                username = mem) THEN
        RAISE EXCEPTION '% user doesnot exists', mem;
    END IF;
END LOOP;
    FOREACH mem IN ARRAY members LOOP
        INSERT INTO member
            VALUES (mem, pid, 'member');
    END LOOP;
END
$$
LANGUAGE plpgsql;

-- #10procedure change password (authenticate the old password before adding the new one)
CREATE PROCEDURE change_password (usr text, oldpswd text, newpswd text
)
    AS $$
DECLARE
    pswmatch boolean;
BEGIN
    SELECT
        (PASSWORD = crypt(oldpswd, PASSWORD)) INTO pswmatch
    FROM
        users
    WHERE
        username = usr;
    IF pswmatch THEN
        UPDATE
            users
        SET
            PASSWORD = crypt(newpswd, gen_salt('bf'));
    END IF;
END
$$
LANGUAGE plpgsql;

-- #11 Procedure Delete member (delete memeber if user doing it is a leader and send error if member doesnot exist)
CREATE OR REPLACE PROCEDURE delete_member (usrname text, mem text, pid int
)
    AS $$
BEGIN
    IF EXISTS (
        SELECT
            1
        FROM
            member
        WHERE
            username = usrname
            AND projectid = pid
            AND ROLE = 'leader') THEN
    IF EXISTS (
        SELECT
            1
        FROM
            member
        WHERE
            username = mem
            AND projectid = pid) THEN
    DELETE FROM member
    WHERE username = mem
        AND projectid = pid;
ELSE
    RAISE EXCEPTION '% is not a member of the project', mem;
END IF;
        ELSE
            RAISE EXCEPTION '% is not a leader of the project', usrname;
END IF;
END
$$
LANGUAGE plpgsql;

-- #12 Procedure => (add task with assigned to and prereq task values if user is a leader and members assigned to exists)
CREATE OR REPLACE PROCEDURE add_task (assignedby text, assignedto text[], pid int, title text, description text, st timestamp, et timestamp, priority text, preqtaskid int[]
)
    AS $$
DECLARE
    tid int;
    m text;
    p int;
BEGIN
    IF NOT EXISTS (
        SELECT
            1
        FROM
            member
        WHERE
            username = assignedby
            AND projectid = pid
            AND ROLE = 'leader') THEN
    RAISE EXCEPTION '% user is not a leader', assignedby;
END IF;
INSERT INTO task (title, description, starttime, endtime, assignedby, projectid)
    VALUES (title, description, st, et, assignedby, pid)
RETURNING
    taskid INTO tid;
    foreach m IN ARRAY assignedto LOOP
        IF NOT EXISTS (
            SELECT
                1
            FROM
                member
            WHERE
                username = m
                AND projectid = pid) THEN
        RAISE exception '% is not a member', m;
    END IF;
INSERT INTO assignedto
    VALUES (tid, m);
END LOOP;
    foreach p IN ARRAY preqtaskid LOOP
        INSERT INTO preqtask
            VALUES (p, tid);
    END LOOP;
END
$$
LANGUAGE plpgsql;

-- #13 procedure => (check if user is a leader and delete assignedto and preqtask where task is refered)
CREATE OR REPLACE PROCEDURE deleteTask (tid int, usrname text
)
    AS $$
DECLARE
    pid int;
BEGIN
    SELECT
        projectid INTO pid
    FROM
        task
    WHERE
        taskid = tid;
    IF EXISTS (
        SELECT
            1
        FROM
            member
        WHERE
            username = usrname
            AND projectid = pid
            AND ROLE = 'leader') THEN
    DELETE FROM assignedto
    WHERE taskid = tid;
    DELETE FROM preqtask
    WHERE task = tid;
    DELETE FROM task
    WHERE taskid = tid;
ELSE
    RAISE exception '% is not a leader', usrname;
END IF;
END
$$
LANGUAGE plpgsql;

-- #14 procedure =>(set staus to completed if task is assigned to user and also enter current timestamp)
CREATE OR REPLACE PROCEDURE complete_task (tid int, usr text
)
    AS $$
BEGIN
    IF EXISTS (
        SELECT
            1
        FROM
            assignedto
        WHERE
            taskid = tid
            AND username = usr) THEN
    UPDATE
        task
    SET
        status = 'completed',
        completiontime = NOW()
    WHERE
        taskid = tid;
END IF;
END
$$
LANGUAGE plpgsql;

-- #15 trigger => add a board for a user and each project
CREATE OR REPLACE FUNCTION add_board ()
    RETURNS TRIGGER
    AS $$
BEGIN
    IF TG_TABLE_NAME = 'project' THEN
        INSERT INTO board (title, projectid)
            VALUES ('Project Board_' || NEW.projectid, NEW.projectid);
    END IF;
    IF TG_TABLE_NAME = 'users' THEN
        INSERT INTO board (title, username)
            VALUES ('User Board_' || NEW.username, NEW.username);
    END IF;
    RETURN NEW;
END
$$
LANGUAGE plpgsql;

CREATE TRIGGER add_board
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION add_board ();

CREATE TRIGGER add_board
    AFTER INSERT ON project
    FOR EACH ROW
    EXECUTE FUNCTION add_board ();

-- # 16 trigger => while insert in board rasie exception if both username and projectid is empty
CREATE OR REPLACE FUNCTION check_board ()
    RETURNS TRIGGER
    AS $$
BEGIN
    IF NEW.projectid IS NULL AND NEW.username IS NULL THEN
        RAISE exception 'one of username or project id required';
        RETURN NULL;
    ELSE
        RETURN new;
    END IF;
END
$$
LANGUAGE plpgsql;

CREATE TRIGGER check_board
    BEFORE INSERT ON board
    FOR EACH ROW
    EXECUTE FUNCTION check_board ();

-- #17 Procedure => add note to project only if user is a member
CREATE PROCEDURE add_note (usr text, pid int, title text, description text, color text
)
    AS $$
BEGIN
    IF NOT EXISTS (
        SELECT
            1
        FROM
            member
        WHERE
            username = usr
            AND projectid = pid) THEN
    RAISE exception '% is not a member of the project', usr;
ELSE
    INSERT INTO note (title, description, color, boardid, createdby)
        VALUES (title, description, color, (
                SELECT
                    boardid
                FROM
                    board
                WHERE
                    projectid = pid), usr);
END
$$
LANGUAGE plpgsql;


-- projectReport
SELECT COUNT(*)
FROM task
WHERE projectid = 1;

SELECT status, COUNT(1)
FROM task
WHERE projectid = 1
GROUP BY status;

SELECT COUNT(*)
FROM task
WHERE completiontime IS NOT NULL;

SELECT COUNT(*) as completedbeforedealine
FROM task
WHERE endtime <= completiontime;

SELECT COUNT(*) as completedafterdealine
FROM task
WHERE endtime > completiontime;

-- intervalReport
SELECT COUNT(*)
FROM task
WHERE projectid = 1 AND starttime >= '2020-04-13' AND endtime <= '2020-04-18';

SELECT status, COUNT(1)
FROM task
WHERE projectid = 1 AND starttime >= '2020-04-13' AND endtime <= '2020-04-18'
GROUP BY status;

SELECT COUNT(*)
FROM task
WHERE completiontime IS NOT NULL AND starttime >= '2020-04-13' AND endtime <= '2020-04-18';

SELECT COUNT(*) as completedbeforedealine
FROM task
WHERE endtime <= completiontime AND starttime >= '2020-04-13' AND endtime <= '2020-04-18';

SELECT COUNT(*) as completedafterdealine
FROM task
WHERE endtime > completiontime AND starttime >= '2020-04-13' AND endtime <= '2020-04-18';

-- myProjects
SELECT *
FROM project
WHERE username = 'arpit';

-- allNotes
SELECT *
FROM note
WHERE columnid = 1;
