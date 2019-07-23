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
    // connectionString: process.env.DATABASE_URL,
    // ssl: true
    connection: {
      host: "127.0.0.1",
      user: "postgres",
      password: "",
      database: "tippingapp"
    }
  }
});

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("it is working!");
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

// /profile/:userId --> GET = user
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

// /fixtures --> GET = Fixtures
app.get("/tips", (req, res) => {
  fixtures.handleFixturesGet(req, res, db);
});

// /image --> PUT --> user
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
