const handleFixturesGet = (req, res, db) => {
  // const { round } = req.params;

  db.select("*")
    .from("fixtures")
    .where("date", ">=", 20190314)
    .andWhere("date", "<=", 20191006)
    .then(round => {
      console.log(round);
      res.status(200).json(round);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({ message: "Error getting fixtures", err: error });
    });
};

module.exports = {
  handleFixturesGet: handleFixturesGet
};
