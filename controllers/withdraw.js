const { User, Investment, Withdrawal } = require("../modules/database/models");

exports.withdrawal = (req, res) => {
  const username = req.params.username;
  User.findOne({ username }).exec((err, user) => {
    if (err) res.json({ error: err });
    else {
      Investment.findOne({ username }).exec((err, invest) => {
        if (err) res.json({ error: err });
        if (!invest) {
          res.render("user/withdraw", {
            user: user,
            invest: null,
            type: "",
            heading: "",
            message: "",
          });
        } else {
          res.render("user/withdraw", {
            user: user,
            invest: invest,
            type: "",
            heading: "",
            message: "",
          });
        }
      });
    }
  });
};

exports.withdrawal_request = (req, res) => {
  const username = req.params.username;
  const orderid = "RSG-" + Math.floor(Math.random() * 900000 + 100000);
  var options = { year: "numeric", month: "short", day: "numeric" };
  const date = new Date().toLocaleDateString("en-us", options);
  let {
    trx_account,
    trx_amount,
    bank_name,
    account_name,
    account_no,
    trx_pin,
  } = req.body;
  var amount = trx_amount - 2.5;
  const withdraw = new Withdrawal({
    userid: username,
    order_id: orderid,
    trx_account: trx_account,
    amount: amount,
    bank_name: bank_name,
    account_name: account_name,
    account_no: account_no,
    status: "Pending",
    submitted: date,
  });
  let query = [
    User.findOne({ username }),
    Investment.findOne({ username }),
    Investment.find({ username }).sort({ _id: -1 }).limit(1),
  ];

  Promise.all(query)
    .then((results) => {
      let user = results[0];
      let invest = results[1];
      let lastInvestment = results[2];
      let available_funds = user.accountbal - lastInvestment[0].amount / 2;
      //   if (trx_amount <= 0) {
        console.log(trx_amount, available_funds, trx_account == "Account" && trx_amount >= available_funds + 1);
      if (trx_account == "Account" && trx_amount >= available_funds + 1) {
        res.render("user/withdraw", {
          user: user,
          invest: invest,
          type: "danger",
          heading: "Error!",
          message:
            "You can only withdraw 50% of your capital at this time! Kindly contact the Admin for further inquiry.",
        });
        if (trx_amount <= 0) {
          res.render("user/withdraw", {
            user: user,
            invest: invest,
            type: "danger",
            heading: "Error!",
            message: "You have entered an invalid amount!",
          });
        }
      } else if (user.pin != trx_pin) {
        res.render("user/withdraw", {
          user: user,
          invest: invest,
          type: "danger",
          heading: "Authentication Failed!",
          message: "You have entered an incorrect pin!",
        });
      } else if (user.pin == trx_pin) {
        withdraw.save((err) => {
          if (err) res.json({ error: err });
          else {
            if (trx_account == "Account" && trx_amount <= user.accountbal) {
              User.updateOne(
                { username: username },
                { $inc: { accountbal: -trx_amount } },
                (err) => {
                  if (err) res.json({ error: err });
                  else {
                    Withdrawal.findOne(
                      { order_id: orderid },
                      (err, withdrawal) => {
                        if (err) throw new Error(err);
                        else {
                          res.render("user/withdrawal-details", {
                            user: user,
                            withdrawal: withdrawal,
                            type: "success",
                            heading: "Success",
                            message:
                              "Your withdrawal request has been sent successfully!",
                          });
                        }
                      }
                    );
                  }
                }
              );
            } else if (trx_account == "ROI" && trx_amount <= user.roi_earning) {
              User.updateOne(
                { username: username },
                { $inc: { roi_earning: -trx_amount } },
                (err) => {
                  if (err) res.json({ error: err });
                  else {
                    Withdrawal.findOne(
                      { order_id: orderid },
                      (err, withdrawal) => {
                        if (err) throw new Error(err);
                        else {
                          res.render("user/withdrawal-details", {
                            user: user,
                            withdrawal: withdrawal,
                            type: "success",
                            heading: "Success",
                            message:
                              "Your withdrawal request has been sent successfully!",
                          });
                        }
                      }
                    );
                  }
                }
              );
            } else if (
              trx_account == "Referral" &&
              trx_amount <= user.referral_earning
            ) {
              User.updateOne(
                { username: username },
                { $inc: { referral_earning: -trx_amount } },
                (err) => {
                  if (err) res.json({ error: err });
                  else {
                    Withdrawal.findOne(
                      { order_id: orderid },
                      (err, withdrawal) => {
                        if (err) throw new Error(err);
                        else {
                          res.render("user/withdrawal-details", {
                            user: user,
                            withdrawal: withdrawal,
                            type: "success",
                            heading: "Success",
                            message:
                              "Your withdrawal request has been sent successfully!",
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        });
      }
    })
    .catch();
};

exports.withdrawal_history = (req, res) => {
  const username = req.params.username;
  User.findOne({ username: username }, (err, user) => {
    if (err) res.json({ err: err });
    else {
      Withdrawal.find({ userid: username }, (err, withdrawals) => {
        if (err) res.json({ error: err });
        else {
          res.render("user/withdrawal-history", {
            withdrawals: withdrawals,
            user: user,
          });
        }
      });
    }
  });
};

exports.withdrawal_details = (req, res) => {
  const orderid = req.params.withdraw_id;
  // const username = req.params.username;
  Withdrawal.findOne({ order_id: orderid }, (err, withdrawal) => {
    if (err) res.json({ error: err });
    else {
      const username = withdrawal.userid;
      User.findOne({ username: username }, (err, user) => {
        if (err) res.json({ err: err });
        else {
          res.render("user/withdrawal-details", {
            withdrawal: withdrawal,
            user: user,
            type: "",
            heading: "",
            message: "",
          });
        }
      });
    }
  });
};
