import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";

// Create HTTP server and express app
const app= express();
const server = http.createServer(app);

//Middleware setup
app.use(express.json({limit:"10mb"}));
app.use(cors());

app.use("/api/status",(req,res)=> res.send("server is running..."));

const PORT = process.env.PORT || 5000;
server.listen(PORT,()=> console.log("Server is running on port " + PORT));