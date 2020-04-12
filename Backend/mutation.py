import graphene
import query


class CreateUser(graphene.Mutation):
    class Arguments:
        username = graphene.String()
        firstname = graphene.String()
        lastname = graphene.String()
        password = graphene.String()
        emailid = graphene.String()

    status = graphene.String()

    def mutate(root, info, username, firstname, lastname, password, emailid):
        s = query.insertUser(username, firstname, lastname, password, emailid)
        return CreateUser(status=s)
