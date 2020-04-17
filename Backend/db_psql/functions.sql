CREATE OR REPLACE FUNCTION gen_project_report(pid integer)
RETURNS TABLE(key text, value int) AS $$
DECLARE
    inactive int;
    active int;
    working int;
    completed_before int;
    completed_after int;
    total int;
BEGIN
    SELECT COUNT(*) INTO total
    FROM task t
    WHERE t.projectid = pid;

    SELECT COUNT(*) INTO inactive
    FROM task t
    WHERE t.projectid = pid AND status = 'inactive';

    SELECT COUNT(*) INTO active
    FROM task t
    WHERE t.projectid = pid AND status = 'active';

    SELECT COUNT(*) INTO working
    FROM task t
    WHERE t.projectid = pid AND status = 'working';

    SELECT COUNT(*) INTO completed_before
    FROM task t
    WHERE t.projectid = pid AND status = 'completed' AND completiontime <= endtime;

    SELECT COUNT(*) INTO completed_after
    FROM task t
    WHERE t.projectid = pid AND status = 'completed' AND completiontime > endtime;

    CREATE TEMP TABLE report(
        key text PRIMARY KEY,
        value int
    );

    INSERT INTO report
    VALUES
        ('inactive', inactive),
        ('active', active),
        ('working', working),
        ('completed_before', completed_before),
        ('completed_after', completed_after),
        ('total', total);

    RETURN QUERY SELECT * FROM report;
    DROP TABLE IF EXISTS report;
END;
$$ LANGUAGE plpgsql;

-- Project report with user
CREATE OR REPLACE FUNCTION gen_user_report(pid int)
RETURNS TABLE(key text, value int) AS $$
DECLARE
    cursor1 cursor(pidc int) for select distinct username from member where projectid = pidc;
    inactive int;
    active int;
    working int;
    completed_before int;
    completed_after int;
    total int;
BEGIN
    FOR r in cursor1(pid) loop
        SELECT COUNT(*) INTO total
        FROM task t
        WHERE t.taskid = (SELECT taskid FROM assignedto WHERE r.username) AND t.projectid = pid;

        SELECT COUNT(*) INTO inactive
        FROM task t
        WHERE t.taskid = (SELECT taskid FROM assignedto WHERE r.username) AND status = 'inactive' AND t.projectid = pid;

        SELECT COUNT(*) INTO active
        FROM task t
        WHERE t.taskid = (SELECT taskid FROM assignedto WHERE r.username) AND status = 'active' AND t.projectid = pid;

        SELECT COUNT(*) INTO working
        FROM task t
        WHERE t.taskid = (SELECT taskid FROM assignedto WHERE r.username) AND status = 'working' AND t.projectid = pid;

        SELECT COUNT(*) INTO completed_before
        FROM task t
        WHERE t.taskid = (SELECT taskid FROM assignedto WHERE r.username) AND status = 'completed' AND completiontime <= endtime
        AND t.projectid = pid;

        SELECT COUNT(*) INTO completed_after
        FROM task t
        WHERE t.taskid = (SELECT taskid FROM assignedto WHERE r.username) AND status = 'completed' AND completiontime > endtime
        AND t.projectid = pid;
    end loop;

    CREATE TEMP TABLE report(
        key text PRIMARY KEY,
        value int
    );

    INSERT INTO report
    VALUES
        ('inactive', inactive),
        ('active', active),
        ('working', working),
        ('completed_before', completed_before),
        ('completed_after', completed_after),
        ('total', total);

    RETURN QUERY SELECT * FROM report;
    DROP TABLE IF EXISTS report;
END;
$$ LANGUAGE plpgsql;

-- User report
CREATE OR REPLACE FUNCTION gen_user_report(uname text)
RETURNS TABLE(key text, value int) AS $$
DECLARE
    inactive int;
    active int;
    working int;
    completed_before int;
    completed_after int;
    total int;
BEGIN
    SELECT COUNT(*) INTO total
    FROM task t
    WHERE t.taskid = (SELECT taskid FROM assignedto WHERE username = uname);

    SELECT COUNT(*) INTO inactive
    FROM task t
    WHERE t.taskid = (SELECT taskid FROM assignedto WHERE username = uname) AND status = 'inactive';

    SELECT COUNT(*) INTO active
    FROM task t
    WHERE t.taskid = (SELECT taskid FROM assignedto WHERE username = uname) AND status = 'active';

    SELECT COUNT(*) INTO working
    FROM task t
    WHERE t.taskid = (SELECT taskid FROM assignedto WHERE username = uname) AND status = 'working';

    SELECT COUNT(*) INTO completed_before
    FROM task t
    WHERE t.taskid = (SELECT taskid FROM assignedto WHERE username = uname) AND status = 'completed' AND completiontime <= endtime;

    SELECT COUNT(*) INTO completed_after
    FROM task t
    WHERE t.taskid = (SELECT taskid FROM assignedto WHERE username = uname) AND status = 'completed' AND completiontime > endtime;

    CREATE TEMP TABLE report(
        key text PRIMARY KEY,
        value int
    );

    INSERT INTO report
    VALUES
        ('inactive', inactive),
        ('active', active),
        ('working', working),
        ('completed_before', completed_before),
        ('completed_after', completed_after),
        ('total', total);

    RETURN QUERY SELECT * FROM report;
    DROP TABLE IF EXISTS report;
END;
$$ LANGUAGE plpgsql;
