import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";

// Create HTTP server and express app
const app= express();
const server = http.createServer(app);

//Middleware setup
app.use(express.json({limit:"10mb"}));
app.use(cors());

//Routes setup
app.use("/api/status",(req,res)=> res.send("server is running..."));
app.use("/api/auth",userRouter);


//connect to database
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT,()=> console.log("Server is running on port " + PORT));