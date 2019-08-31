const handleTips = (req, res, db) => {
  const { fixture_id, selection } = req.body;

  db.transaction(trx => {
    trx
      .insert({
        fixture_id: fixture_id,
        selection: selection
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
      message: "unable to register"
    };
    res.status(400).json(errMsg);
  });
};

module.exports = {
  handleTips: handleTips
};
