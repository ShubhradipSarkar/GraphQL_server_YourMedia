const graphql = require("graphql");

const QueryRoot  = new graphql.GraphQLObjectType({
    name : 'Query',
    fields : () => ({
        hello : {
            type : graphql.GraphQLString,
            resolve : ()=> "Hello from graphQL!"
        }
    })
});

const RootSchema = new graphql.GraphQLSchema({query : QueryRoot});

module.exports = {RootSchema};