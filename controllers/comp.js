const handleTipsGet = (req, res, db) => {
  db.select("*")
    .from("tips")
    .then(tips => {
      console.log(tips);
      res.status(200).json(tips);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({ message: "Error getting tips", err: error });
    });
};

module.exports = {
  handleTipsGet: handleTipsGet
};
