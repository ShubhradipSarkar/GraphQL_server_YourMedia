const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { RootSchema } = require('./schema/schema');
const mongoose = require('mongoose');
require("dotenv").config();
const app = express()

mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("MongodbConnected")})
.catch((err)=>{console.log("Couldn't connect", err)});

app.use('/api' , graphqlHTTP({
    schema: RootSchema,
    graphiql: true,  
}));

app.listen(4000, ()=>console.log("Server is running at PORT 4000"));
