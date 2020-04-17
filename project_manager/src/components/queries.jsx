import { gql } from "apollo-boost";
import { HttpLink } from "apollo-link-http";
const uri = "http://localhost:5000/graphql-api";
export const link = new HttpLink({ uri });
export const createUser = gql`
  mutation(
    $firstname: String!
    $lastname: String!
    $username: String!
    $emailid: String!
    $password: String!
  ) {
    createUser(
      firstname: $firstname
      lastname: $lastname
      username: $username
      emailid: $emailid
      password: $password
    ) {
      msg
      status
    }
  }
`;
export const authenticate = gql`
  query($username: String!, $password: String!) {
    authenticate(username: $username, password: $password)
  }
`;

export const getUser = gql`
  query($username: String!) {
    getUser(username: $username) {
      firstname
      lastname
      email
    }
  }
`;
