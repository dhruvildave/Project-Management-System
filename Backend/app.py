# Imports
from graphene import ObjectType, String, Int, Schema, Boolean, Field, List, NonNull
from flask import Flask
from flask_graphql import GraphQLView
from flask_cors import CORS as cors
import pg

import mutation
import query
import Object

# initializing our app
app = Flask(__name__)
cors(app)
app.debug = True


class Query(ObjectType):
    # this defines a Field `hello` in our Schema with a single Argument `name`
    authenticate = Field(Boolean,
                         args={
                             'username': String(required=True),
                             'password': String(required=True)
                         })

    getUser = Field(Object.User, args={'username': String(required=True)})

    myNotes = Field(List(Object.Note),
                    args={'username': String(required=True)})

    myProjects = Field(List(Object.Project),
                       args={
                           'username': String(required=True),
                           'project_filter': String()
    })
    getProject = Field(Object.Project,
                       args={
                           'username': String(required=True),
                           'projectid': Int(required=True)
                       })
    projectNotes = Field(List(Object.Note),
                         args={'projectid': Int(required=True)})
    myTasks = Field(List(Object.Task),
                    args={
                        'username': String(required=True),
                        'taskFilter': String()
    })
    ProjectTasks = Field(List(Object.Task),
                         args={
                             'username': String(required=True),
                             'projectid': Int(required=True),
                             'taskFilter': String()
    })
    getTask = Field(Object.Task, args={'taskid': Int(required=True)})

    # our Resolver method takes the GraphQL context (root, info) as well as
    # Argument (name) for the Field and returns data for the query Response
    def resolve_authenticate(root, info, username, password):
        return query.f_authenticate(username, password)

    def resolve_getUser(root, info, username):
        return query.f_getuser(username)

    def resolve_myNotes(root, info, username):
        return query.f_mynotes(username)

    def resolve_myProjects(root, info, username, project_filter=None):
        return query.f_myprojects(username, project_filter)

    def resolve_getProjects(root, info, username, projectid):
        return query.f_getproject(username, projectid)

    def resolve_projectNotes(root, info, projectid):
        return query.f_projectNotes(projectid)

    def resolve_myTasks(root, info, username, taskFilter=None):
        return query.f_getmytask(username, taskFilter)

    def resolve_ProjectTasks(root, info, username, projectid, taskFilter=None):
        return query.f_getprojecttask(username, projectid, taskFilter)

    def resolve_getTask(root, info, taskid):
        return query.f_gettask(taskid)


class Mutation(ObjectType):
    create_user = mutation.createUser.Field()
    change_password = mutation.changePassword.Field()
    change_name = mutation.changeName.Field()
    delete_user = mutation.deleteUser.Field()
    create_project = mutation.createProject.Field()
    edit_project = mutation.editProject.Field()
    delete_project = mutation.deleteProject.Field()
    delete_member = mutation.deleteMember.Field()
    add_task = mutation.addTask.Field()
    update_task = mutation.updateTask.Field()
    delete_task = mutation.deleteTask.Field()
    complete_task = mutation.completeTask.Field()
    add_note = mutation.addNote.Field()
    edit_note = mutation.editNote.Field()
    delete_note = mutation.deleteNote.Field()


schema = Schema(query=Query, mutation=Mutation)


@app.route('/')
# @cors_origin()
def index():
    return '<html><body><h1>Welcome API 2.0</h1><code>path: /graphql-api<code></body></html>'


app.add_url_rule(
    '/graphql-api',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True  # for having the GraphiQL interface
    ))

if __name__ == '__main__':
    app.run()
