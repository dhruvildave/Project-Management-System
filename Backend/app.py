# Imports
from flask import Flask
from flask_graphql import GraphQLView
import pg
# initializing our app
app = Flask(__name__)
app.debug = True

from graphene import ObjectType, String, Schema
import mutation


class Query(ObjectType):
    # this defines a Field `hello` in our Schema with a single Argument `name`
    hello = String(name=String(default_value="stranger"))
    goodbye = String()

    # our Resolver method takes the GraphQL context (root, info) as well as
    # Argument (name) for the Field and returns data for the query Response
    def resolve_hello(root, info):
        return f'Hello'


class Mutation(ObjectType):
    create_user = mutation.createUser.Field()
    change_name = mutation.changeName.Field()
    delete_user = mutation.deleteUser.Field()
    create_project = mutation.createProject.Field()
    delete_project = mutation.deleteProject.Field()
    change_projectname = mutation.changeProjectName.Field()
    add_Member = mutation.addMembers.Field()


schema = Schema(query=Query, mutation=Mutation)


@app.route('/')
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
