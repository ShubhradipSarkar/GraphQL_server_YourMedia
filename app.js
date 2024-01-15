const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { RootSchema } = require('./schema/schema');

const app = express()

app.use('/api' , graphqlHTTP({
    schema: RootSchema,
    graphiql: true,  
}));

app.listen(4000, ()=>console.log("Server is running at PORT 4000"));
