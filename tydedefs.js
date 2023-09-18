//const {gql} = require('apollo-server-express');

const typeDefs = `
type User {
    id: ID!
    name: String
    email: String
}

type Query {
    Users: [User]
}
type Mutation {
    createUser(name: String!, email: String!): User
  }
  
`;

module.exports= typeDefs;