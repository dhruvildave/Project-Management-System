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

CREATE TYPE project_status AS enum (
    'completed',
    'ongoing'
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
    createdby text REFERENCES users (username) ON DELETE CASCADE,
    status project_status DEFAULT 'completed' NOT NULL,
    UNIQUE (name, createdby)
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
    lastupdated timestamp NOT NULL DEFAULT now(),
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
    FOREIGN KEY (assignedby, projectid) REFERENCES member (username, projectid) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (title, assignedby, projectid)
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
    boardid int REFERENCES board (boardid) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (title, description)
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
BEGIN
    IF NOT EXISTS (
        SELECT
            1
        FROM
            project
        WHERE
            projectid = pid
            AND createdby = usr) THEN
    RAISE exception 'Project can only be deleted by the user who created it';
ELSE
    DELETE FROM project
    WHERE projectid = pid;
END IF;
END
$$
LANGUAGE plpgsql;

-- #8 procedure => edit project (leader can remove other leaders but not the creator)
CREATE OR REPLACE PROCEDURE edit_project (usr text, pid int, n text, sd text, ld text, p text, members text[][]
)
    AS $$
DECLARE
    userrole text;
    mem text[];
    own text;
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
            name = n,
            shortdescription = sd,
            longdescription = ld,
            path = p
        WHERE
            projectid = pid
        RETURNING
            createdby INTO own;
    ELSE
        RAISE EXCEPTION 'user is not a leader';
    END IF;
    DELETE FROM member
    WHERE projectid = pid
        AND username != own;
    INSERT INTO member
        VALUES (usr, pid, 'leader');
    FOREACH mem slice 1 IN ARRAY members LOOP
        INSERT INTO member
            VALUES (mem[1]::text, pid, mem[2]::role_type);
    END LOOP;
END
$$
LANGUAGE plpgsql;

-- #9 procedure -> create project and add members
--
--
-- {
--   "data": {
--     "createProject": {
--       "status": false,
--       "msg": "ERROR:  duplicate key value violates unique constraint \"member_pkey\"\nDETAIL:  Key (username, projectid)=(dhruvil91, 12) already exists.\nCONTEXT:  SQL statement \"INSERT INTO member\n            VALUES (mem[1]::text, pid, mem[2]::role_type)\"\nPL/pgSQL function create_project(text,text,text,text,text,text[]) line 11 at SQL statement\n"
--     }
--   }
-- }
--
--

CREATE OR REPLACE PROCEDURE create_project (usr text, name text, sd text, ld text, path text, members text[][]
)
    AS $$
DECLARE
    mem text[];
    pid int;
BEGIN
    INSERT INTO project (name, shortdescription, longdescription, createdon, path, createdby)
        VALUES (name, sd, ld, CURRENT_DATE, path, usr)
    RETURNING
        projectid INTO pid;
    IF array_length(members, 1) > 0 THEN
        FOREACH mem slice 1 IN ARRAY members LOOP
            INSERT INTO member
                VALUES (mem[1]::text, pid, mem[2]::role_type);
        END LOOP;
    END IF;
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
    IF pswmatch AND newpswd !~ '(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,72}$' THEN
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
    IF preqtaskid IS NOT NULL THEN
        foreach p IN ARRAY preqtaskid LOOP
            INSERT INTO preqtask
                VALUES (tid, p);
        END LOOP;
    END IF;
END
$$
LANGUAGE plpgsql;

-- # procedure => update task if user is a leader and make changes in the assignedto and preqtask tables
CREATE OR REPLACE PROCEDURE edit_task (usr text, tid int, assignedto text[], t text, des text, st timestamp, et timestamp, prior text, preqtaskid int[]
)
    AS $$
DECLARE
    m text;
    pid int;
    p int;
BEGIN
    SELECT
        projectid INTO pid
    FROM
        task
    WHERE
        taskid = tid;
    IF NOT EXISTS (
        SELECT
            1
        FROM
            member
        WHERE
            username = usr
            AND projectid = pid
            AND ROLE = 'leader') THEN
    RAISE EXCEPTION '% user is not a leader', usr;
END IF;
    UPDATE
        task
    SET
        title = t,
        description = des,
        starttime = st,
        endtime = et,
        priority = prior,
        assignedby = usr
    WHERE
        taskid = tid;
    DELETE FROM assignedto
    WHERE taskid = tid;
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
    DELETE FROM preqtask
    WHERE task = tid;
    foreach p IN ARRAY preqtaskid LOOP
        INSERT INTO preqtask
            VALUES (p, tid);
    END LOOP;
END
$$
LANGUAGE plpgsql;

-- #13 procedure => (check if user is a leader and delete assignedto and preqtask where task is refered)
CREATE OR REPLACE PROCEDURE delete_task (tid int, usrname text
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
            task
        WHERE
            taskid = tid
            AND status = 'completed') THEN
    RAISE exception 'task already completed';
END IF;
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
        ELSE
            RAISE exception 'task is not assigned to the user';
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
        RAISE exception 'one of username or project id is required';
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
END IF;
END
$$
LANGUAGE plpgsql;

-- projectReport
CREATE OR REPLACE FUNCTION gen_project_report (pid integer)
    RETURNS TABLE (
        KEY text,
        value int
    )
    AS $$
DECLARE
    inactive int;
    active int;
    working int;
    completed_before int;
    completed_after int;
    total int;
BEGIN
    SELECT
        COUNT(*) INTO total
    FROM
        task t
    WHERE
        t.projectid = pid;
    SELECT
        COUNT(*) INTO inactive
    FROM
        task t
    WHERE
        t.projectid = pid
        AND status = 'inactive';
    SELECT
        COUNT(*) INTO active
    FROM
        task t
    WHERE
        t.projectid = pid
        AND status = 'active';
    SELECT
        COUNT(*) INTO working
    FROM
        task t
    WHERE
        t.projectid = pid
        AND status = 'working';
    SELECT
        COUNT(*) INTO completed_before
    FROM
        task t
    WHERE
        t.projectid = pid
        AND status = 'completed'
        AND completiontime <= endtime;
    SELECT
        COUNT(*) INTO completed_after
    FROM
        task t
    WHERE
        t.projectid = pid
        AND status = 'completed'
        AND completiontime > endtime;
    CREATE TEMP TABLE report (
        key text PRIMARY KEY,
        value int
    );
INSERT INTO report
    VALUES ('inactive', inactive), ('active', active), ('working', working), ('completed_before', completed_before), ('completed_after', completed_after), ('total', total);
    RETURN QUERY
    SELECT
        *
    FROM
        report;
    DROP TABLE IF EXISTS report;
END;
$$
LANGUAGE plpgsql;

-- Project report with user
CREATE OR REPLACE FUNCTION gen_userwise_report (pid int)
    RETURNS TABLE (
        KEY text,
        value int
    )
    AS $$
DECLARE
    cursor1 CURSOR (pidc int)
    FOR SELECT DISTINCT
            username
        FROM
            member
        WHERE
            projectid = pidc;
    inactive int;
    active int;
    working int;
    completed_before int;
    completed_after int;
    total int;
BEGIN
    FOR r IN cursor1 (pid)
    LOOP
        SELECT
            COUNT(*) INTO total
        FROM
            task t
        WHERE
            t.taskid = (
                SELECT
                    taskid
                FROM
                    assignedto
                WHERE
                    r.username)
            AND t.projectid = pid;
        SELECT
            COUNT(*) INTO inactive
        FROM
            task t
        WHERE
            t.taskid = (
                SELECT
                    taskid
                FROM
                    assignedto
                WHERE
                    r.username)
            AND status = 'inactive'
            AND t.projectid = pid;
        SELECT
            COUNT(*) INTO active
        FROM
            task t
        WHERE
            t.taskid = (
                SELECT
                    taskid
                FROM
                    assignedto
                WHERE
                    r.username)
            AND status = 'active'
            AND t.projectid = pid;
        SELECT
            COUNT(*) INTO working
        FROM
            task t
        WHERE
            t.taskid = (
                SELECT
                    taskid
                FROM
                    assignedto
                WHERE
                    r.username)
            AND status = 'working'
            AND t.projectid = pid;
        SELECT
            COUNT(*) INTO completed_before
        FROM
            task t
        WHERE
            t.taskid = (
                SELECT
                    taskid
                FROM
                    assignedto
                WHERE
                    r.username)
            AND status = 'completed'
            AND completiontime <= endtime
            AND t.projectid = pid;
        SELECT
            COUNT(*) INTO completed_after
        FROM
            task t
        WHERE
            t.taskid = (
                SELECT
                    taskid
                FROM
                    assignedto
                WHERE
                    r.username)
            AND status = 'completed'
            AND completiontime > endtime
            AND t.projectid = pid;
    END LOOP;
    CREATE TEMP TABLE report (
        key text PRIMARY KEY,
        value int
    );
INSERT INTO report
    VALUES ('inactive', inactive), ('active', active), ('working', working), ('completed_before', completed_before), ('completed_after', completed_after), ('total', total);
    RETURN QUERY
    SELECT
        *
    FROM
        report;
    DROP TABLE IF EXISTS report;
END;
$$
LANGUAGE plpgsql;

-- User report
CREATE OR REPLACE FUNCTION gen_user_report (uname text)
    RETURNS TABLE (
        KEY text,
        value int
    )
    AS $$
DECLARE
    inactive int;
    active int;
    working int;
    completed_before int;
    completed_after int;
    total int;
BEGIN
    SELECT
        COUNT(*) INTO total
    FROM
        task t
    WHERE
        t.taskid = (
            SELECT
                taskid
            FROM
                assignedto
            WHERE
                username = uname);
    SELECT
        COUNT(*) INTO inactive
    FROM
        task t
    WHERE
        t.taskid = (
            SELECT
                taskid
            FROM
                assignedto
            WHERE
                username = uname)
        AND status = 'inactive';
    SELECT
        COUNT(*) INTO active
    FROM
        task t
    WHERE
        t.taskid = (
            SELECT
                taskid
            FROM
                assignedto
            WHERE
                username = uname)
        AND status = 'active';
    SELECT
        COUNT(*) INTO working
    FROM
        task t
    WHERE
        t.taskid = (
            SELECT
                taskid
            FROM
                assignedto
            WHERE
                username = uname)
        AND status = 'working';
    SELECT
        COUNT(*) INTO completed_before
    FROM
        task t
    WHERE
        t.taskid = (
            SELECT
                taskid
            FROM
                assignedto
            WHERE
                username = uname)
        AND status = 'completed'
        AND completiontime <= endtime;
    SELECT
        COUNT(*) INTO completed_after
    FROM
        task t
    WHERE
        t.taskid = (
            SELECT
                taskid
            FROM
                assignedto
            WHERE
                username = uname)
        AND status = 'completed'
        AND completiontime > endtime;
    CREATE TEMP TABLE report (
        key text PRIMARY KEY,
        value int
    );
INSERT INTO report
    VALUES ('inactive', inactive), ('active', active), ('working', working), ('completed_before', completed_before), ('completed_after', completed_after), ('total', total);
    RETURN QUERY
    SELECT
        *
    FROM
        report;
    DROP TABLE IF EXISTS report;
END;
$$
LANGUAGE plpgsql;

-- intervalReport
SELECT
    COUNT(*)
FROM
    task
WHERE
    projectid = 1
    AND starttime >= '2020-04-13'
    AND endtime <= '2020-04-18';

SELECT
    status,
    COUNT(1)
FROM
    task
WHERE
    projectid = 1
    AND starttime >= '2020-04-13'
    AND endtime <= '2020-04-18'
GROUP BY
    status;

SELECT
    COUNT(*)
FROM
    task
WHERE
    completiontime IS NOT NULL
    AND starttime >= '2020-04-13'
    AND endtime <= '2020-04-18';

SELECT
    COUNT(*) AS completedbeforedealine
FROM
    task
WHERE
    endtime <= completiontime
    AND starttime >= '2020-04-13'
    AND endtime <= '2020-04-18';

SELECT
    COUNT(*) AS completedafterdealine
FROM
    task
WHERE
    endtime > completiontime
    AND starttime >= '2020-04-13'
    AND endtime <= '2020-04-18';

-- myProjects
-- SELECT
--     *
-- FROM
--     project
-- WHERE
--     username = 'arpit';
-- -- allNotes
-- SELECT
--     *
-- FROM
--     note
-- WHERE
--     columnid = 1;
-- function my projects

CREATE OR REPLACE FUNCTION myprojects (usr text, f text)
    RETURNS TABLE (
        pid int,
        projectname text,
        sd text,
        ld text,
        DOC date,
        projectpath text,
        OWNER text,
        members text[],
        roles text[]
    )
    AS $$
DECLARE
    r Record;
    cur1 CURSOR (usern text)
    FOR
        SELECT
            projectid AS pid
        FROM
            member
        WHERE
            username = usern;
BEGIN
    IF f IS NOT NULL THEN
        FOR r IN cur1 (usr)
        LOOP
            RETURN query
            SELECT
                projectid AS pid,
                name AS projectname,
                shortdescription AS sd,
                longdescription AS ld,
                createdon AS DOC,
                path AS projectpath,
                createdby AS OWNER,
                array_agg(username) AS members,
                array_agg(ROLE)::text[] AS roles
            FROM
                project
            NATURAL JOIN member
        WHERE
            projectid = r.pid
                AND status = f::project_status
            GROUP BY
                projectid;
        END LOOP;
    ELSE
        FOR r IN cur1 (usr)
        LOOP
            RETURN query
            SELECT
                projectid AS pid,
                name AS projectname,
                shortdescription AS sd,
                longdescription AS ld,
                createdon AS DOC,
                path AS projectpath,
                createdby AS OWNER,
                array_agg(username) AS members,
                array_agg(ROLE)::text[] AS roles
            FROM
                project
            NATURAL JOIN member
        WHERE
            projectid = r.pid
        GROUP BY
            projectid;
        END LOOP;
    END IF;
    RETURN;
END
$$
LANGUAGE plpgsql;

-- # trigger => update project status to completed if all task are completed
CREATE OR REPLACE FUNCTION check_projectstatus ()
    RETURNS TRIGGER
    AS $check_projectstatus$
BEGIN
    IF EXISTS (
        SELECT
            *
        FROM
            task
        WHERE
            projectid = NEW.projectid
            AND status != 'completed') THEN
    UPDATE
        project
    SET
        status = 'ongoing'
    WHERE
        projectid = NEW.projectid;
ELSE
    UPDATE
        project
    SET
        status = 'completed'
    WHERE
        projectid = NEW.projectid;
END IF;
    RETURN new;
END;
$check_projectstatus$
LANGUAGE plpgsql;

CREATE TRIGGER check_projectstatus
    AFTER INSERT OR UPDATE ON task
    EXECUTE FUNCTION check_projectstatus ();

-- procedure => get project given pid and username
CREATE OR REPLACE FUNCTION getproject (text, int)
    RETURNS TABLE (
        pid int,
        projectname text,
        sd text,
        ld text,
        DOC date,
        projectpath text,
        OWNER text,
        members text[],
        roles text[]
    )
    AS $$
BEGIN
    IF NOT EXISTS (
        SELECT
            1
        FROM
            member
        WHERE
            username = $1
            AND projectid = $2) THEN
    RAISE exception 'user is not a member';
ELSE
    RETURN QUERY
    SELECT
        projectid AS pid,
        name AS projectname,
        shortdescription AS sd,
        longdescription AS ld,
        createdon AS DOC,
        path AS projectpath,
        createdby AS OWNER,
        array_agg(username) AS members,
        array_agg(ROLE)::text[] AS roles
    FROM
        project
    NATURAL JOIN member
WHERE
    projectid = $2
GROUP BY
    projectid;
END IF;
    RETURN;
END
$$
LANGUAGE plpgsql;

-- # check if user is a member
CREATE FUNCTION check_member (text, int)
    RETURNS boolean
    AS $$
BEGIN
    RETURN
    SELECT
        EXISTS (
            SELECT
                1
            FROM
                member
            WHERE
                projectid = $2
                AND username = $1);
END
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION project_task (text, int, text = NULL)
    RETURNS TABLE (
        tid int,
        t text,
        des text,
        st timestamp,
        et timestamp,
        ct timestamp,
        s text,
        p text,
        pid int,
        BY text,
        assignedto text[],
        preqid int[]
    )
    AS $$
BEGIN
    IF (
        SELECT
            check_member ($1, $2)) THEN
        IF $3 IS NOT NULL THEN
            RETURN query
            SELECT
                taskid,
                title,
                description,
                starttime,
                endtime,
                completiontime,
                status::text,
                priority::text,
                projectid,
                assignedby,
                array_agg(assignedto.username) AS assignedto,
                array_agg(preqtask.preqtask) AS preqtask
            FROM (task
            NATURAL JOIN assignedto)
        LEFT OUTER JOIN preqtask ON (assignedto.taskid = preqtask.task)
    WHERE
        projectid = $2
        AND status = $3::status_type
    GROUP BY
        taskid;
        ELSE
            RETURN query
            SELECT
                taskid,
                title,
                description,
                starttime,
                endtime,
                completiontime,
                status::text,
                priority::text,
                projectid,
                assignedby,
                array_agg(assignedto.username) AS assignedto,
                array_agg(preqtask.preqtask) AS preqtask
            FROM (task
            NATURAL JOIN assignedto)
        LEFT OUTER JOIN preqtask ON (assignedto.taskid = preqtask.task)
    WHERE
        projectid = $2
    GROUP BY
        taskid;
        END IF;
    ELSE
        RAISE exception 'user is not a member';
    END IF;
    RETURN;
END
$$
LANGUAGE plpgsql;

-- function my_task
CREATE OR REPLACE FUNCTION my_task (text, text = NULL)
    RETURNS TABLE (
        tid int,
        t text,
        des text,
        st timestamp,
        et timestamp,
        ct timestamp,
        s text,
        p text,
        pid int,
        BY text,
        assignedto text[],
        preqid int[]
    )
    AS $$
BEGIN
    IF $2 IS NOT NULL THEN
        RETURN query
        SELECT
            taskid,
            title,
            description,
            starttime,
            endtime,
            completiontime,
            status::text,
            priority::text,
            projectid,
            assignedby,
            array_agg(assignedto.username) AS assignedto,
            array_agg(preqtask.preqtask) AS preqtask
        FROM (task
        NATURAL JOIN assignedto)
    LEFT OUTER JOIN preqtask ON (assignedto.taskid = preqtask.task)
WHERE
    assignedto.username = $1
    AND status = $2::status_type
GROUP BY
    taskid;
    ELSE
        RETURN query
        SELECT
            taskid,
            title,
            description,
            starttime,
            endtime,
            completiontime,
            status::text,
            priority::text,
            projectid,
            assignedby,
            array_agg(assignedto.username) AS assignedto,
            array_agg(preqtask.preqtask) AS preqtask
        FROM (task
        NATURAL JOIN assignedto)
    LEFT OUTER JOIN preqtask ON (assignedto.taskid = preqtask.task)
WHERE
    assignedto.username = $1
GROUP BY
    taskid;
    END IF;
    RETURN;
END
$$
LANGUAGE plpgsql;
