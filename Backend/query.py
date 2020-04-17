import pg
from collections import namedtuple


def f_authenticate(username, password):
    data = pg.executequery2(
        'SELECT (password = crypt(%s, password)) AS pswmatch FROM users where username = %s ;',
        [password, username])
    return data[0][0]


User = namedtuple("User", ['username', 'firstname', 'lastname', 'email'])


def f_getuser(username):
    data = pg.executequery2(
        'SELECT username,firstname,lastname,emailid FROM users WHERE username = %s',
        [username])
    if len(data) < 1:
        raise ValueError('User not found')
    else:
        return User(data[0][0], data[0][1], data[0][2], data[0][3])


Note = namedtuple(
    "Note",
    ["noteid", "title", "description", "color", "createdby", "createdat"])


def f_mynotes(username):
    data = pg.executequery2(
        'SELECT noteid,title,description,color,createdby,createdat from note WHERE boardid = (select boardid from board where username = %s)',
        [username])
    return [Note(x[0], x[1], x[2], x[3], x[4], x[5]) for x in data]


Project = namedtuple("Project", [
    'projectid', 'name', 'shortdescription', 'longdescription', 'createdon',
    'path', 'createdby', 'members'
])

Member = namedtuple("Member", ['user', 'role'])


def f_myprojects(username):
    data = pg.executequery2('select * from myprojects(%s)', [username])

    return [
        Project(x[0], x[1], x[2], x[3], x[4], x[5], x[6],
                [Member(i, j) for i, j in zip(x[7], x[8])]) for x in data
    ]


if __name__ == "__main__":
    print(f_myprojects('arpit921'))
