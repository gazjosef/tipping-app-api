const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

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
const port = process.env.PORT || 3000;
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

app.post("/signin", (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare(
    "mangoes",
    "$2a$10$xDDkYgRO5eKn6hXRCbxBneAxKn9W2iVcPjoSl1v0AmdriJjYz52dG",
    function(err, res) {
      console.log("first guess", res);
    }
  );
  bcrypt.compare(
    "veggies",
    "$2a$10$xDDkYgRO5eKn6hXRCbxBneAxKn9W2iVcPjoSl1v0AmdriJjYz52dG",
    function(err, res) {
      console.log("second guess", res);
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx, commit)
      .catch(trx, rollback);
  }).catch(err => {
    let errMsg = {
      error: err,
      message: "unable to register"
    };
    res.status(400).json(errMsg);
  });
});

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
  console.log("app is running on port 3000");
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/
