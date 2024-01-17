const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { RootSchema } = require('./schema/schema');
const mongoose = require('mongoose');

const app = express()

mongoose.connect("mongodb+srv://YourMediaDB2:YourMediaDB2@cluster0.iiwf00c.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{console.log("MongodbConnected")})
.catch((err)=>{console.log("Couldn't connect", err)});

app.use('/api' , graphqlHTTP({
    schema: RootSchema,
    graphiql: true,  
}));

app.listen(4000, ()=>console.log("Server is running at PORT 4000"));
