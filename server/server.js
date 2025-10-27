import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import {Server} from "socket.io";
import { console } from "inspector";

// Create HTTP server and express app
const app= express();
const server = http.createServer(app);

// Initialize socket.io
export const io = new Server(server,{
    cors:{origin:"*"}
})

// store online users
export const userSocketMap={}; // {userId:socketId}

// socket.io connection handler
io.on("connection", (socket)=>{
    const userId=socket.handshake.query.userId;
    console.log("User Connected ", userId); 
   
    if(userId) userSocketMap[userId]=socket.id;

    // Emit online users to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    
    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})


//Middleware setup
app.use(express.json({limit:"10mb"}));
app.use(cors());

//Routes setup
app.use("/api/status",(req,res)=> res.send("server is running..."));
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);


//connect to database
await connectDB();

if(process.env.NODE_ENV!=="production"){
const PORT = process.env.PORT || 5000;
server.listen(PORT,()=> console.log("Server is running on port " + PORT));
}
 export default server;
