const handleTips = (req, res, db) => {
  const { userid, fixtureid, selection } = req.body;
  console.log("userid: ", userid);
  console.log("fixtureid: ", fixtureid);
  console.log("selection: ", selection);

  db.transaction(trx => {
    trx
      .insert({
        userid: userid,
        fixtureid: fixtureid,
        tip: selection
      })
      .into("tips")

      // db.transaction(trx => {
      //   trx
      //     .insert({
      //       hash: hash,
      //       email: email
      //     })
      //     .into("login")
      //     .returning("email")
      //     .then(loginEmail => {
      //       return trx("users")
      //         .returning("*")
      //         .insert({
      //           email: loginEmail[0],
      //           name: name,
      //           joined: new Date()
      //         })
      //         .then(user => {
      //           res.json(user[0]);
      //         });
      //     })
      .then(trx.commit)
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
