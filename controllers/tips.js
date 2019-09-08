const handleTips = (req, res, db) => {
  const { userid, fixtureid, selection } = req.body;
  console.log("userid: ", userid);
  console.log("fixtureid: ", fixtureid);
  console.log("selection: ", selection);

  db.transaction(trx => {
    trx
      .insert({
        user_id: userid,
        fixture_id: fixtureid,
        selection: selection
      })
      .into("tips")
      .then(trx.commit)
      .then(() => {
        res.status(200).json({
          message: "successfully tipped"
        });
      })
      .catch(trx.rollback);
  }).catch(err => {
    let errMsg = {
      error: err,
      message: "unable to tip"
    };
    res.status(400).json(errMsg);
  });
};

module.exports = {
  handleTips: handleTips
};
