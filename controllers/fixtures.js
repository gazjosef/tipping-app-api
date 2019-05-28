const handleFixturesGet = (req, res, db) => {
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
};

module.exports = {
  handleFixturesGet: handleFixturesGet
};
