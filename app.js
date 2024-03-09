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
// const { Server } = require("socket.io")
// var http = require('http');
// var server = http.createServer(app);
// var io = new Server(server,{
//     cors:{
//         origin: '*'
//     }
// });
// //const server = new Server(app)
// io.on("connection", (socket)=>{
//     console.log("User connected");
//     console.log("ID", socket.id);
//     socket.emit("welcome", `welcome to the server ${socket.id}`);
//     socket.broadcast.emit("welcome", `${socket.id} joined the server...`);

//     socket.on("message", ({message, room})=>{
//         //console.log(data);
//         io.to(room).emit("receive",message);   
//     })
// })

mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("Mongodb Connected")})
.catch((err)=>{console.log("Couldn't connect to Database", err)});

// Allowing all hosts
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({encoded: false}))

app.use('/auth', auth);   // For register and log in
app.use('/api' ,verifyToken, graphqlHTTP({   // For other queries and updates
    schema: RootSchema,
    graphiql: true,  
}));


app.listen(PORT, ()=>console.log(`Server is running at PORT ${PORT}`));


