require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET , encryptedFields: ['password']});

const userModel = new mongoose.model("user", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/register", function(req, res){
    const user1 = new userModel({
      email: req.body.username,
      password: req.body.password
    });

    user1.save(function(err){
      if(!err){
        res.render("secrets");
      }
      else{
        console.log("error");
      }
    });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  userModel.findOne({email: username}, function(err, result){
    if(err){
      console.log(err);
    }
    else{
      if(result){
        if(result.password === password){
          res.render("secrets");
        }
        else{
          console.log("incorrect password");
        }
      }
    }
  });
});

app.listen(3000, function(){
  console.log("server started...");
});
