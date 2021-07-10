const { User, Investment } = require("../modules/database/models");

exports.invest = (req, res) => {
  const username = req.params.username;
  User.findOne({ username }, (err, user) => {
    if (err) throw new Error(err);
    else {
      Investment.findOne({ username }, (err, invest) => {
        if (err) throw new Error(err);
        if (invest && invest.status == "Active") {
          res.render("user/dashboard", {
            user: user,
            invest: invest,
            type: "warning",
            heading: "Active Investment",
            message:
              "You have an active investment! You cannot have more than one investment plan running at the same time!",
          });
        } else if (!invest || (invest && invest.status == "Inactive")) {
          res.render("user/invest", {
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

//Process Investment
exports.process_investment = (req, res) => {
  const {
    i_plan,
    i_tenor,
    i_rate,
    i_amount,
    i_roi,
    i_start_date,
    i_end_date,
    i_order_id,
    tpin,
    username,
  } = req.body;
  if (i_plan === "Bronze") {
    var interest = parseInt(i_roi);
  } else if (i_plan == "Silver") {
    var interest = parseInt(i_roi);
  } else if (i_plan == "Gold") {
    var interest = parseInt(i_roi);
  }
  var monthly_roi = parseFloat(interest.toFixed(2));
  var transfer_pin = parseInt(tpin);
  const point = (i_amount * 500) / 1000;
  User.findOne({ username }).exec((err, user) => {
    if (err || !user) {
      res.render("user/invest", {
        user: user,
        type: "danger",
        heading: "Something Went Wrong",
        message: err,
      });
    } else if (user.pin !== transfer_pin) {
      res.render("user/invest", {
        user: user,
        type: "danger",
        heading: "Invalid Transaction Pin",
        message:
          "You have entered an incorrect transaction pin! Please check the pin and try again!",
      });
    } else if (user.pin === transfer_pin) {
      const invest = new Investment({
        order_id: i_order_id,
        username: username,
        plan: i_plan,
        tenure: i_tenor,
        rate: i_rate,
        monthly_roi: monthly_roi,
        amount: i_amount,
        roi: i_roi,
        start_date: i_start_date,
        end_date: i_end_date,
        status: "Active",
        counter: 0,
      });
      invest.save((err) => {
        if (err) {
          res.render("user/invest", {
            user: user,
            type: "danger",
            heading: "Something Went Wrong",
            message: err,
          });
        } else {
          var ref_bonus = (parseInt(i_amount) * 5) / 100;
          let queries = [
            User.updateOne(
              { username },
              { $inc: { accountbal: -i_amount, ppv: point } }
            ),
            User.updateOne(
              { username: user.referral },
              { $inc: { referral_earning: ref_bonus, dpv: point } }
            ),
            Investment.findOne({ username }),
            // Referral.updateOne({"tree.username":username},{$set:{'tree.$.status':1}})
          ];

          Promise.all(queries)
            .then((results) => {
              let invest = results[2];
              res.render("user/investment-history", {
                user: user,
                invest: invest,
                type: "success",
                heading: "Success",
                message: "Investment Successfully Activated",
              });
            })
            .catch((err) => {
              res.render("user/invest", {
                user: user,
                type: "danger",
                heading: "Something Went Wrong",
                message: err,
              });
            });
        }
      });
    }
  });
};

//Show Investments
exports.investments = (req, res) => {
  const username = req.params.username;
  User.findOne({ username }, (err, user) => {
    if (err) {
      throw new Error(err);
    } else {
      Investment.find({ username }, (err, invest) => {
        if (err) console.log(err);
        if (!invest) {
          console.log("Not Found!");
          // res.render("user/dashboard", {
          //   user: user,
          //   invest: null,
          //   type: "success",
          //   heading: "Show Investments",
          //   message: "You do not have any active investment at the moment!",
          // });
        } else {
          console.log(invest);
          // res.render("user/investment-history", { user: user, invest: invest });
        }
      });
    }
  });
};

// Show Invest Details
exports.invest_details = (req, res) => {
  const username = req.params.username;
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      res.json({ error: err });
    } else {
      Investment.findOne({ username }, (err, invest) => {
        if (err) {
          res.json({ error: err });
        } else {
          res.render("user/investment-details", {
            user: user,
            invest: invest,
          });
        }
      });
    }
  });
};
