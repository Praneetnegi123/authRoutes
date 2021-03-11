require('dotenv').config();

const express = require("express");
const app = express();
let db = require("./mongo/database");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// var jwt = require("express-jwt");
var jwt = require("jsonwebtoken");

//!create a function for generate a jwt token
function generateAccessToken(username) {
  return jwt.sign({ username }, process.env.JWT_SECRET_KEY);
}

console.log('----');
console.log(generateAccessToken('sarthak'));
console.log('----');

// "eyJhbGciOiJIUzI1NiJ9.YW5raXQxMUBnbWFpbC5jb20.D5I3JoiD9dzQ2R-BpCG99U86gWTWuLVuFfDU4McX0OA"
//!creating a middle for authencation
const checkAuthentication = async (req, res, next) => {
  try {
    let decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY
    );
    if (!decoded) {
      return res.send("Unathenticated User");
    }
  
    next();
  } catch (err) {
    return res.send("Unathenticated User");
  }
  
};

app.get("/user", checkAuthentication, async (req, res) => {
  let allUsers = await db.find({});
  res.json(allUsers);
});

//!add a user in addUser route
app.post("/addUser", (req, res) => {
  let { email, password } = req.body;
  let user = db({ email, password });
  user.save();

  res.json("Successfully Added User!");
});

//! Login the user by hit the login route
app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  data = await db.findOne({ email });
  if (data) {
    if (data.password === password) {
      res.send(generateAccessToken(email));
    } else {
      res.send("Wrong Password");
    }
  } else {
    res.send("Wrong Email");
  }
});

// let token =
//   "eyJhbGciOiJIUzI1NiJ9.c2hpdmFtMDFAZ21haWwuY29t.tN-Vc_cPaRA2uGzlnsZAHC1hxZEl7RW0QY1nHqJmQeg";

// console.log(decoded);

app.listen(8080, () => {
  console.log("listening at PORT 8080");
});

// let daa = db({ email: "praneetnegi01@gmail.com", password: "1234" });
// daa.save();

// app.get("/user", async (req, res) => {
//     let allUsers = await db.find({});
//     console.log(allUsers);
//     res.json(allUsers);
//   });
