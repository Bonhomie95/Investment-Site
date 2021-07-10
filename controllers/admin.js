const bcrypt = require("bcryptjs");

const {
  Admin,
  Epin,
  Investment,
  Withdrawal,
  User,
} = require("../modules/database/models");
const { transporter } = require("../modules/functions/objects");

//<--Admin Sign In-->
exports.signin = (req, res) => {
  res.render("admin/sign-in", {
    type: "",
    heading: "",
    message: "",
  });
};

//2FA (Authentication Level 1)
exports.authenticate = (req, res) => {
  const { userid, passkey } = req.body;
  Admin.findOne({ userid: userid, password: passkey }).exec((err, user) => {
    if (err) throw new Error(err);
    if (!user) {
      res.render("admin/sign-in", {
        type: "danger",
        heading: "Authentication Failed",
        message: "You have entered and invalid Login details",
      });
    } else {
      const token = parseInt(Math.random() * 902000 + 123456);
      const mailOptions = {
        from: '"noreply", admin@rsglobal.com.ng',
        to: "rsglobal.com.ng@gmail.com",
        subject: "Admin Login",
        html: `
            <p style="margin-bottom: 10px;"><b>Hi Admin</b></p>
            <p style="margin-bottom: 25px;">Use the code below to complete your login.</p>
            <h5 style="margin-bottom: 10px;">${token}</h5><br>
            <p style="margin: 0; font-size: 13px; line-height: 22px; color:#9ea8bb;">This is an automatically generated email please do not reply to this email. If you face any issues, please contact us at  support@rsglobal.com</p>

            `,
      };
      Admin.updateOne({ userid: userid }, { pin: token }, (err) => {
        if (err) throw new Error(err);
        else {
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) throw new Error(err);
            res.render("admin/token", {
              userid: userid,
              password: passkey,
              type: "success",
              heading: "Success!",
              message:
                "Kindly complete your login with the token sent to your mail.",
            });
          });
        }
      });
    }
  });
};

//2FA (Authentication Level 2)
exports.authenticate1 = (req, res) => {
  const { userid, passkey, token } = req.body;
  Admin.findOne({ userid: userid, password: passkey, pin: token }).exec(
    (err, admin) => {
      if (err) throw new Error(err);
      if (!admin) {
        res.render("admin/token", {
          userid: userid,
          password: passkey,
          type: "danger",
          heading: "Authentication Failed",
          message: "You have entered and invalid token",
        });
      } else {
        let queries = [
          Investment.aggregate([
            { $group: { _id: null, amount: { $sum: "$amount" } } },
          ]),
          Withdrawal.aggregate([
            { $group: { _id: null, amount: { $sum: "$amount" } } },
          ]),
          User.aggregate([
            { $group: { _id: null, amount: { $sum: "$accountbal" } } },
          ]),
          Investment.find().sort({ _id: -1 }).limit(4).exec(),
          Withdrawal.find().sort({ _id: -1 }).limit(10).exec(),
          Investment.aggregate([
            { $match: { status: "Inactive" } },
            { $group: { _id: null, amount: { $sum: "$roi" } } },
          ]),
          Investment.aggregate([
            { $match: { status: "Active" } },
            { $group: { _id: null, amount: { $sum: "$amount" } } },
          ]),
        ];

        Promise.all(queries)
          .then((results) => {
            let investments = results[0];
            let withdrawals = results[1];
            let accounts = results[2];
            let invests = results[3];
            let withdraws = results[4];
            let totalRoi = results[5];
            let curInvestment = results[6];

            res.render("admin/dashboard", {
              type: "",
              heading: "",
              message: "",
              invests: invests,
              withdraws: withdraws,
              investments: investments,
              withdrawals: withdrawals,
              accounts: accounts,
              totalRoi: totalRoi,
              curInvestment: curInvestment,
            });
          })
          .catch((err) => {
            res.json({ message: "Something Went Wrong!", error: err });
          });
      }
    }
  );
};

//Admin Logged
exports.adminlogged = (req, res) => {
  let queries = [
    Investment.aggregate([
      { $group: { _id: null, amount: { $sum: "$amount" } } },
    ]),
    Withdrawal.aggregate([
      { $group: { _id: null, amount: { $sum: "$amount" } } },
    ]),
    User.aggregate([
      { $group: { _id: null, amount: { $sum: "$accountbal" } } },
    ]),
    Investment.find().sort({ _id: -1 }).limit(4).exec(),
    Withdrawal.find().sort({ _id: -1 }).limit(10).exec(),
    Investment.aggregate([
      { $match: { status: "Inactive" } },
      { $group: { _id: null, amount: { $sum: "$roi" } } },
    ]),
    Investment.aggregate([
      { $match: { status: "Active" } },
      { $group: { _id: null, amount: { $sum: "$amount" } } },
    ]),
    Investment.updateMany({ tenor: 183 }, { $set: { tenor: 365 } }),
  ];

  Promise.all(queries)
    .then((results) => {
      let investments = results[0];
      let withdrawals = results[1];
      let accounts = results[2];
      let invests = results[3];
      let withdraws = results[4];
      let totalRoi = results[5];
      let curInvestment = results[6];

      res.render("admin/dashboard", {
        type: "",
        heading: "",
        message: "",
        invests: invests,
        withdraws: withdraws,
        investments: investments,
        withdrawals: withdrawals,
        accounts: accounts,
        totalRoi: totalRoi,
        curInvestment: curInvestment,
      });
    })
    .catch((err) => {
      res.json({ message: "Something Went Wrong!", error: err });
    });
};

//<--EPIN-->
//Get Route
exports.epin = (req, res) => {
  Epin.find((err, pins) => {
    if (err) throw new Error(err);
    res.render("admin/epin", {
      pins: pins,
      type: "",
      heading: "",
      message: "",
    });
  });
};

//Create Pin
exports.create_epin = (req, res) => {
  const { value, serial } = req.body;
  const epin = new Epin({
    pin: serial,
    value: value,
    status: false,
  });
  Epin.find((err, pins) => {
    if (err) throw new Error(err);
    Epin.findOne({ pin: serial }, (err, pin) => {
      if (err) throw new Error(err);
      if (pin) {
        res.render("admin/epin", {
          pins: pins,
          type: "Danger",
          heading: "Pin Already Exists",
          message:
            "The generated serial already exist. Kindly generate a new serial!",
        });
      } else if (!pin) {
        epin.save((err) => {
          if (err) throw new Error(err);
          res.render("admin/epin", {
            pins: pins,
            type: "Success",
            heading: "Pin Created",
            message: "Pin has been successfully created!",
          });
        });
      }
    });
  });
};

//<--Investments-->
//Show all investments
exports.show_investments = (req, res) => {
  Investment.find().exec((err, investments) => {
    if (err) throw new Error(err);
    res.render("admin/investment", { investments: investments });
  });
};

//<--Withdrawals-->
//Pending Withdrawal
exports.pending = (req, res) => {
  Withdrawal.find({ status: "Pending" }, (err, pendings) => {
    if (err) throw new Error(err);
    res.render("admin/withdrawals", {
      pendings: pendings,
      type: "",
      heading: "",
      message: "",
    });
  });
};

//Processed Withdrawal
exports.processed = (req, res) => {
  Withdrawal.find({ status: "Completed" }, (err, pendings) => {
    if (err) throw new Error(err);
    res.render("admin/processed", {
      pendings: pendings,
      type: "",
      heading: "",
      message: "",
    });
  });
};

//Declined Withdrawals
exports.declined = (req, res) => {
  Withdrawal.find({ status: "Declined" }, (err, pendings) => {
    if (err) throw new Error(err);
    res.render("admin/declined", {
      pendings: pendings,
      type: "",
      heading: "",
      message: "",
    });
  });
};

//Approved Withdrawal
exports.approve = (req, res) => {
  const orderid = req.params.order_id;
  const date = new Date().toLocaleDateString();
  Withdrawal.updateOne(
    { order_id: orderid },
    { status: "Completed", approved: date },
    (err) => {
      if (err) throw new Error(err);
      else {
        Withdrawal.find({ status: "Pending" }, (err, pendings) => {
          if (err) throw new Error(err);
          res.render("admin/withdrawals", {
            pendings: pendings,
            type: "success",
            heading: "Success!",
            message: "Withdrawal has been approved",
          });
        });
      }
    }
  );
};

//Decline Withdrawal
exports.reject = (req, res) => {
  const orderid = req.params.order_id;
  const date = new Date().toLocaleDateString();
  Withdrawal.findOne({ order_id: orderid }, (err, result) => {
    if (err) throw new Error(err);
    else {
      const id = result.userid;
      const amount = result.amount;
      User.updateOne({ username: id }, { accountbal: amount }, (err) => {
        if (err) throw new Error(err);
        else {
          Withdrawal.updateOne(
            { order_id: orderid },
            { status: "Declined" },
            (err) => {
              if (err) throw new Error(err);
              else {
                Withdrawal.find({ status: "Pending" }, (err, pendings) => {
                  if (err) throw new Error(err);
                  res.render("admin/withdrawals", {
                    pendings: pendings,
                    type: "success",
                    heading: "Success!",
                    message: "Withdrawal has been rejected successfully!",
                  });
                });
              }
            }
          );
        }
      });
    }
  });
};

//Withdrawal Details
exports.withdrawal_details = (req, res) => {
  const id = req.params.order_id;
  Withdrawal.findOne({ order_id: id }, (err, order) => {
    if (err) throw new Error(err);
    else {
      User.findOne({ username: order.userid }, (err, user) => {
        if (err) throw new Error(err);
        else {
          res.render("admin/withdrawal-details", {
            withdrawal: order,
            user: user,
          });
        }
      });
    }
  });
};

//<--CLIENTS-->
//All Users
exports.users = (req, res) => {
  User.find((err, users) => {
    if (err) throw new Error(err);
    res.render("admin/manage-users", {
      users,
    });
  });
};

//View User Details
exports.view_user = (req, res) => {
  const username = req.params.username;

  let queries = [
    User.findOne({ username }),
    Withdrawal.find({ userid: username }),
    Investment.find({ username }),
    Epin.find({ user: username }),
  ];

  Promise.all(queries)
    .then((results) => {
      let user = results[0];
      let withdrawals = results[1];
      let investments = results[2];
      let pins = results[3];

      res.render("admin/user-details", {
        user,
        withdrawals,
        investments,
        pins,
      });
    })
    .catch((err) => {
      res.json(err);
    });
};

//Suspend User
exports.suspend_user = (req, res) => {
  const username = req.params.username;

  User.updateOne({ username }, { $set: { status: 1 } }, (err) => {
    if (err) return err;
    res.redirect("/rsglobal131220-allusers");
  });
};

//Re-activate User
exports.activate_user = (req, res) => {
  const username = req.params.username;

  User.updateOne({ username }, { $set: { status: 0 } }, (err) => {
    if (err) return err;
    res.redirect("/rsglobal131220-allusers");
  });
};

//Show Single Investment
exports.single_investment = (req, res) => {
  const order_id = req.params.order_id;

  Investment.findOne({ order_id }, (err, invest) => {
    if (err) return err;
    let username = invest.username;
    User.findOne({ username }, (err, user) => {
      if (err) return err;
      res.render("admin/investment-details", { invest, user });
    });
  });
};

//Suspend Investment
exports.suspend_investment = (req, res) => {
  const order_id = req.params.order_id;

  Investment.updateOne(
    { order_id },
    { $set: { status: "Suspended" } },
    (err) => {
      if (err) return err;
      res.redirect("/rsglobal131220-investments");
    }
  );
};

//Re-activate Investment
exports.reactivate_investment = (req, res) => {
  const order_id = req.params.order_id;

  Investment.updateOne({ order_id }, { $set: { status: "Active" } }, (err) => {
    if (err) return err;
    res.redirect("/rsglobal131220-investments");
  });
};

//Reset User Password
exports.reset_user_password = (req, res) => {
  const username = req.params.username;

  let new_password = (Math.floor(Math.random() * 8000000000 + 123456789)).toString();

  User.findOne({username},(err,user)=>{
    if(err) res.send(err);

    bcrypt.hash(new_password, 10, (err, hashedPassword) => {
      if (err) res.json({ message: "Something Went Wrong!" });
      User.updateOne(
        { username },
        { $set: { password: hashedPassword } },
        (err) => {
          if (err) res.json({ message: err });
          let email = user.email;
          const mailOptions = {
            from: "'noreply',admin@rsglobal.com.ng",
            to: email,
            subject: "RSGLOBAL Password Reset",
            html: `
                        <h2 style="font-size: 18px; color: #1ee0ac; font-weight: 600; margin: 0;">Password Reseted</h2>
                        <p style="margin-bottom: 10px;"><b>Hi ${user.firstname}</b></p>
                        <p>You Successfully Reseted Your Password. Thanks For being with Us.</p>
                        <p style="margin-bottom: 25px;">Your new password is: <h2>${new_password}</h2></p>
                        <br>
                         <p style="margin: 0; font-size: 13px; line-height: 22px; color:#9ea8bb;">This is an automatically generated email please do not reply to this email. If you face any issues, please contact us at  support@rsglobal.com</p>
                        `,
          };
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) res.json({message: err});
            res.redirect("/rsglobal131220-allusers");
          });
        }
      );
    });
  })
};
