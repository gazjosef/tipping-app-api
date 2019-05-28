const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");

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
  console.log("in signin");
  signin.handleSignin(req, res, db, bcrypt);
});

// /register --> POST = user

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// *** Dependency injection

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not Found");
      }
    })
    .catch(err => res.status(400).json("Error getting user"));
});

// Get Fixtures
app.get("/tips", (req, res) => {
  // const { round } = req.params;
  db.select("*")
    .from("fixtures")
    .where("date", ">=", 20190314)
    .andWhere("date", "<", 20190516)
    .then(round => {
      console.log(round);
      res.status(200).json(round);
    })
    .catch(error => {
      res.status(400).json("Error getting fixtures");
    });
  // .then(user => {
  //   if (user.length) {
  //     res.json(user[0]);
  //   } else {
  //     res.status(400).json("Not Found");
  //   }
  // })
  // .catch(err => res.status(400).json("Error getting user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("unable to get entries"));
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
