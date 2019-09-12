const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const fixtures = require("./controllers/fixtures");
const table = require("./controllers/table");
const tips = require("./controllers/tips");
const image = require("./controllers/image");
const users = require("./controllers/users");
const comp = require("./controllers/comp");

let dbConnectionInfo = getDbConnectionInfo();
const db = knex(dbConnectionInfo);

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

// POSTS

// /register --> POST = user
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
// *** Dependency injection

// /tips --> POST = tips
app.post("/tips", (req, res) => {
  tips.handleTips(req, res, db);
});

// GET

// /profile/:userId --> GET = user
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

// /fixtures --> GET = Fixtures
app.get("/fixtures", (req, res) => {
  fixtures.handleFixturesGet(req, res, db);
});

// /table --> GET = Fixtures/Table
app.get("/table", (req, res) => {
  table.handleTableGet(req, res, db);
});

// /comp --> GET = Tips
app.get("/comp", (req, res) => {
  comp.handleTipsGet(req, res, db);
});

// /users --> GET = Users
app.get("/users", (req, res) => {
  users.handleUsers(req, res, db);
});

// PUT

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
function getDbConnectionInfo() {
  if (process.env.DATABASE_URL === undefined) {
    console.log("Local database connection");
    return {
      client: "pg",
      connection: {
        host: "127.0.0.1",
        user: "postgres",
        password: "",
        database: "tippingapp"
      }
    };
  } else {
    console.log("Heroku database connection");
    return {
      client: "pg",
      connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
      }
    };
  }
}
