const handleUsers = (req, res, db) => {
  db.select("*")
    .from("users")
    .then(users => {
      console.log(users);
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({ message: "Error getting users", err: error });
    });
};

module.exports = {
  handleUsers: handleUsers
};
