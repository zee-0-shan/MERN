const express = require("express");
const dotenv =require("dotenv");
const mongoose= require("mongoose");
const app = express();

dotenv.config({path:"./config.env"});
require("./db/conn");
// const User=require("./model/userSchema");
app.use(express.json());

// linking router file to make our route easy
app.use(require("./router/auth"))

const PORT=process.env.PORT;

app.get("/",(req,res)=>{
    res.send(`this is homepage`)
})

app.get("/about",(req,res)=>{
    res.send(`this is about page`)
})

app.get("/contact",(req,res)=>{
    res.cookie("test","zeeshan")
    res.send(`this is contact page`)
})

app.get("/signin",(req,res)=>{
    res.send(`this is signin`)   
})

app.get("/signup",(req,res)=>{
    res.send(`this is registration page`)
})

app.listen(PORT,()=>{
    console.log(`Listening at ${PORT}`);
})