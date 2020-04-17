from graphene import Mutation, ObjectType, String, Boolean, Int, List, NonNull, types, InputObjectType
import pg


class createUser(Mutation):
    class Arguments:
        username = String(required=True)
        firstname = String(required=True)
        lastname = String(required=True)
        password = String(required=True)
        emailid = String(required=True)

    status = Boolean(required=True)
    msg = String()

    def mutate(root, info, username, firstname, lastname, password, emailid):
        s, m = pg.executequery(
            "INSERT INTO users VALUES (%s,%s,%s,%s,%s,%s);",
            [username, firstname, lastname, password, emailid, None])
        return createUser(status=s, msg=m)


class changePassword(Mutation):
    class Arguments:
        username = String(required=True)
        oldpassword = String(required=True)
        newpassword = String(required=True)

    status = Boolean(required=True)
    msg = String()

    def mutate(root, info, username, oldpassword, newpassword):
        s, m = pg.executequery("CALL change_password(%s,%s,%s);",
                               [username, oldpassword, newpassword])
        return changePassword(status=s, msg=m)


class changeName(Mutation):
    class Arguments:
        username = String(required=True)
        newfirstname = String(required=True)
        newlastname = String(required=True)

    status = Boolean(required=True)
    msg = String()

    def mutate(root, info, username, newfirstname, newlastname):
        s, m = pg.executequery(
            "UPDATE users SET firstname=%s, lastname=%s where username = %s",
            [newfirstname, newlastname, username])
        return changeName(status=s, msg=m)


class deleteUser(Mutation):
    class Arguments:
        username = String(required=True)

    status = Boolean(required=True)
    msg = String()

    def mutate(root, info, username):
        s, m = pg.executequery("DELETE FROM users where username = %s",
                               [username])
        return deleteUser(status=s, msg=m)


class createProject(Mutation):
    class Arguments:
        name = String()
        createdby = String()
        path = String()

    status = Boolean(required=True)
    msg = String()

    def mutate(root, info, name, createdby, path=None):
        s, m = pg.executequery(
            "INSERT INTO project(name, createdon, path, createdby) VALUES (%s, CURRENT_DATE, %s,%s);",
            [
                name,
                path,
                createdby,
            ])
        return createProject(status=s, msg=m)


class deleteProject(Mutation):
    class Arguments:
        username = String(required=True)
        projectid = Int(required=True)

    status = Boolean(required=True)
    msg = String()

    def mutate(root, info, username, projectid):
        s, m = pg.executequery("CALL delete_project(%s,%s);",
                               [username, projectid])
        return deleteProject(status=s, msg=m)


class changeProjectName(Mutation):
    class Arguments:
        username = String(required=True)
        projectid = Int(required=True)
        newname = String(required=True)

    status = Boolean(required=True)
    msg = String()

    def mutate(root, info, username, newname, projectid):
        s, m = pg.executequery("CALL change_projectname(%s,%s,%s);",
                               [username, newname, projectid])
        return changeProjectName(status=s, msg=m)


class changeProjectPath(Mutation):
    class Arguments:
        username = String(required=True)
        projectid = Int(required=True)
        newpath = String(required=True)

    status = Boolean(required=True)
    msg = String()

    def mutate(root, info, username, newpath, projectid):
        s, m = pg.executequery("change_projectpath(%s,%s,%s);",
                               [username, newpath, projectid])
        return changeProjectName(status=s, msg=m)


class addMembers(Mutation):
    class Arguments:
        username = String(required=True)
        projectid = Int(required=True)
        members = NonNull(List(NonNull(String)))

    status = Boolean(required=True)
    msg = String()

    def mutate(root, info, username, members, projectid):
        s, m = pg.executequery("CALL add_members(%s,%s,%s);",
                               [username, members, projectid])
        return addMembers(status=s, msg=m)


class deleteMember(Mutation):
    class Arguments:
        username = String(required=True)
        member = String(required=True)
        projectid = String(required=True)

    status = Boolean(required=True)
    msg = String()

    def mutate(root, info, username, member, projectid):
        s, m = pg.executequery("CALL delete_members(%s,%s,%s);",
                               [username, member, projectid])
        return deleteMember(status=s, msg=m)


class addTask(Mutation):
    class Arguments:
        assignedby = String(required=True)
        assignedto = NonNull(List(NonNull(String)))
        projectid = Int(required=True)
        title = String(required=True)
        description = String()
        starttime = types.DateTime()
        endtime = types.DateTime()
        priority = String()
        preqtaskid = List(NonNull(Int))

    status = Boolean(required=True)
    msg = String()

    def mutate(root,
               info,
               assignedby,
               assignedto,
               projectid,
               title,
               description=None,
               startdate=None,
               enddate=None,
               priority=None,
               preqtaskid=None):
        if not priority:
            priority = 'normal'
            s, m = pg.executequery(
                "call add_task (%s,%s,%s,%s,%s,%s,%s,%s);", [
                    assignedby, assignedto, projectid, title, description,
                    startdate, enddate, priority, preqtaskid
                ])
        return addTask(status=s, msg=m)


class deleteTask(Mutation):
    class Arguments:
        username = String(required=True)
        taskid = Int(required=True)

    status = Boolean(required=True)
    msg = String()

    def mutate(root, info, username, taskid):
        s, m = pg.executequery('call delete_task(%s,%s)', [taskid, username])
        return deleteTask(status=s, msg=m)


class completeTask(Mutation):
    class Arguments:
        username = String(required=True)
        taskid = Int(required=True)

    status = Boolean(required=True)
    msg = String()

    def mutate(root, info, username, taskid):
        s, m = pg.executequery('call complete_task (%s,%s);',
                               [taskid, username])
        return completeTask(status=s, msg=m)


class addNote(Mutation):
    class Arguments:
        username = String(required=True)
        title = String(required=True)
        description = String()
        color = String()
        projectid = Int()

    status = Boolean(required=True)
    msg = String()

    def mutate(root,
               info,
               username,
               title,
               projectid=None,
               description=None,
               color=None):
        if not projectid:
            s, m = pg.executequery(
                'insert into note (title,description,color,boardid,createdby) values (%s,%s,%s,(select boardid from board where username = %s),%s);',
                [title, description, color, username, username])

        else:
            s, m = pg.executequery('call add_note (%s, %s,%s,%s,%s)', [
                username,
                projectid,
                title,
                description,
                color,
            ])

        return addNote(status=s, msg=m)


class deleteNote(Mutation):
    class Arguments:
        username = String(required=True)
        noteid = Int(required=True)

    status = Boolean(required=True)
    msg = String()

    def mutate(root, info, username, noteid):
        s, m = pg.executequery('delete from note where noteid = %s);',
                               [noteid, username])
        return deleteNote(status=s, msg=m)


class editNote(Mutation):
    class Arguments:
        username = String(required=True)
        noteid = Int(required=True)
        title = String(required=True)
        description = String()
        color = String()

    status = Boolean(required=True)
    msg = String()

    def mutate(root,
               info,
               username,
               noteid,
               title,
               description=None,
               color=None):
        s, m = pg.executequery(
            'update note set title = %s description = %s color = %s createdby = %s where noteid = %s);',
            [title, description, color, username, noteid])
        return editNote(status=s, msg=m)