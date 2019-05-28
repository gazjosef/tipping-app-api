const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const fixtures = require("./controllers/fixtures");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "",
    database: "tippingapp"
  }
});

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: "1",
      name: "kain",
      email: "kain@gmail.com",
      password: "apples",
      entries: 0,
      joined: new Date()
    },
    {
      id: "2",
      name: "dan",
      email: "dan@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date()
    },
    {
      id: "3",
      name: "gareth",
      email: "gareth@gmail.com",
      password: "oranges",
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "kain@gmail.com"
    }
  ]
};

app.get("/", (req, res) => {
  res.send(database.users);
});

// /signin --> POST = success/fail
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

// /register --> POST = user
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// *** Dependency injection
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

// Get Fixtures
app.get("/tips", (req, res) => {
  fixtures.handleFixturesGet(req, res, db);
});

//image --> PUT --> user
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.listen(port, () => {
  console.log("app is running on port " + port);
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/
