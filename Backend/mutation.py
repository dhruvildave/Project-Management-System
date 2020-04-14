from graphene import Mutation, ObjectType, String, Boolean, Int, List, NonNull, types
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
            "INSERT INTO users VALUES (%s,%s,%s,%s,%s,%s)",
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
        assignedto = NonNull(List(NonNull(String()))),
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
        return deleteMember(status=s, msg=m)
