const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { RootSchema } = require('./schema/schema');
const mongoose = require('mongoose');
require("dotenv").config();
const app = express()
const cors = require('cors');
const auth = require("./routes/auth");
const PORT = process.env.PORT||4000;
const verifyToken = require("./middleware/authMiddleware")

mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("Mongodb Connected")})
.catch((err)=>{console.log("Couldn't connect to Database", err)});

// Allowing all hosts
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({encoded: false}))

app.use('/auth', auth);   // For register and log in
app.use('/api' , graphqlHTTP({   // For other queries and updates
    schema: RootSchema,
    graphiql: true,  
}));

app.listen(PORT, ()=>console.log(`Server is running at PORT ${PORT}`));

