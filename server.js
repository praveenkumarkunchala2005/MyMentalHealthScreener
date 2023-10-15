const http = require("http");
const express = require("express");
const session = require('express-session');
//const mongodb = require("mongodb");
const ejs = require("ejs");
const path =require("path")
const bodyParser = require("body-parser");
const jwt =require("jsonwebtoken");
const cookie=require("cookie-parser");
const app = express();
const Data = require("./models/mongodb");
app.set("view engine", "ejs");
var mongoose = require("mongoose");
app.use(express.static(path.join(__dirname, "public")));
const route= require("./route/route")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookie());
app.use(
  session({
    secret: 'nikhilchary', // Replace with a strong, random secret key
    resave: false,
    saveUninitialized: true,
  })
);
//connceting mongoDB
var mongoDB = "mongodb+srv://praveenkumarkunchala2005:JzpUUezbowSHIdVr@cluster0.eiqjqs9.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("connceted"));

app.use(route)
app.listen(3000, console.log("running"));
