from graphene import ObjectType, String, Field, Int, types, List
import query


class User(ObjectType):
    username = String()
    firstname = String()
    lastname = String()
    email = String()

    def resolve_username(parent, info):
        return parent.username

    def resolve_firstname(parent, info):
        return parent.firstname

    def resolve_lastname(parent, info):
        return parent.lastname

    def resolve_email(parent, info):
        return parent.email


class Note(ObjectType):
    noteid = Int(required=True)
    title = String()
    description = String()
    color = String()
    createdby = String()
    createdat = types.DateTime()

    def resolve_noteid(parent, info):
        return parent.noteid

    def resolve_title(parent, info):
        return parent.title

    def resolve_description(parent, info):
        return parent.description

    def resolve_color(parent, info):
        return parent.color

    def resolve_createdby(parent, info):
        return parent.createdby

    def resolve_firstname(parent, info):
        return parent.createdat


class Member(ObjectType):
    user = Field(User)
    role = String()

    def resolve_user(parent, info):
        return query.f_getuser(parent.user)

    def resolve_lastname(parent, info):
        return parent.role


class Project(ObjectType):
    projectid = Int()
    name = String()
    shortdescription = String()
    longdescription = String()
    createdon = types.Date()
    path = String()
    createdby = Field(User)
    members = Field(List(Member))

    def resolve_projectid(parent, info):
        return parent.projectid

    def resolve_name(parent, info):
        return parent.name

    def resolve_shortdescription(parent, info):
        return parent.shortdescription

    def resolve_longdescription(parent, info):
        return parent.longdescription

    def resolve_createdon(parent, info):
        return parent.createdon

    def resolve_path(parent, info):
        return parent.path

    def resolve_createdby(parent, info):
        return query.f_getuser(parent.createdby)

    def resolve_members(parent, info):
        return parent.members
