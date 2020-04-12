# Imports
from flask import Flask
from flask_graphql import GraphQLView
import query as q
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
        return f'Hello {name}!'

    def resolve_goodbye(root, info):
        return q.allUsers()


class MyMutation(ObjectType):
    create_user = mutation.CreateUser.Field()


schema = Schema(query=Query, mutation=MyMutation)


@app.route('/')
def index():
    return 'Welcome to Api2.0'


app.add_url_rule(
    '/graphql-api',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True  # for having the GraphiQL interface
    ))

if __name__ == '__main__':
    app.run()
