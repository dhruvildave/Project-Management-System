INSERT INTO users
    VALUES ('arpit', 'Arpitsinh', 'Vaghela', 'Password1', 'arpitvaghela9210@gmail.com', NULL);

INSERT INTO users
    VALUES ('kaushal10', 'Kaushal', 'Patil', 'Password1', 'kaushal@gmail.com', NULL);

INSERT INTO project (name, createdon, createdby)
    VALUES ('Project1', CURRENT_DATE, 'arpit');

INSERT INTO member
    VALUES ('kaushal10', 1);

INSERT INTO task (title, description, endtime, assignedby, projectid)
    VALUES ('task1', 'just a task', NULL, 'arpit', 1);
