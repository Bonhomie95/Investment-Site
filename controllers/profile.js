const { User, Investment, Epin } = require("../modules/database/models");
const bcrypt = require("bcryptjs");

//User Profile
exports.profile = (req, res) => {
  const username = req.params.username;
  User.findOne({ username }).exec((err, user) => {
    if (err) throw new Error(err);
    else {
      res.render("user/profile", { user });
    }
  });
};

//User Settings
exports.settings = (req, res) => {
  const username = req.params.username;
  User.findOne({ username }).exec((err, user) => {
    if (err) throw new Error(err);
    else {
      res.render("user/settings", { user: user, type:"", heading:"", message:"" });
    }
  });
};

//Update User
exports.updateprofile = (req, res) => {
  const {
    dob,
    phone_no,
    address,
    state,
    country,
    bank_name,
    account_name,
    account_number,
  } = req.body;
  var realaddress = address + " " + state + " " + country;
  User.updateOne(
    { username: req.params.username },
    {
      dateofbirth: dob,
      phonenumber: phone_no,
      address: realaddress,
      bankname: bank_name,
      accountname: account_name,
      banknumber: account_number,
    },
    (err) => {
      if (err) throw new Error(err);
      else {
        res.redirect("back");
      }
    }
  );
};

//Change Password
exports.changePassword = (req, res) => {
  const { previous_password, new_password } = req.body;
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) res.json({ message: err });
    bcrypt.compare(previous_password, user.password,(err,result)=>{
      if(result === false){
        res.json({message:"Invalid Password. Please check the password you entered and try again"})
      }else if(result === true){
        bcrypt.hash(new_password,10,(err, hashedPassword)=>{
          if(err) res.json({message:"Something Went Wrong!"})
          User.updateOne(
            { username: req.params.username },
            { password: hashedPassword },
            (err) => {
              if (err) res.json({ message: err });
              res.render("user/profile", { user });
            }
          );
        })
      }
    })
  });
};

//Change Transaction Pin
exports.changePin = (req, res) => {
  const { previous_pin, new_pin } = req.body;
  User.findOne({ username: req.params.username }, (err, user) => {
    const pin = parseInt(req.body.previous_pin);
    if (err) res.json({ message: err });
    if (user.pin !== pin)
      res.json({
        message:
          "Invalid Pin. Please check the password you entered and try again",
      });
    else if (user.pin == pin) {
      User.updateOne(
        { username: req.params.username },
        { pin: new_pin },
        (err) => {
          if (err) res.json({ message: err });
          res.redirect("back");
        }
      );
    }
  });
};

//Leg
// exports.tree = (req, res) => {
//     let username = req.params.username;
//     let query = [
//         User.findOne({ username }),
//         // Referral.findOne({ "tree.username": username }),
//         Investment.find()
//     ];

//     Promise.all(query)
//         .then((results) => {
//             let user = results[0];
//             // let referral = results[1].tree;
//             res.render("user/leg", {
//                 user: user,
//                 // referral: referral,
//             });
//         })
//         .catch();
// };
// Deposit
exports.deposit = (req, res) => {
  let username = req.params.username;
  let query = [User.findOne({ username })];

  Promise.all(query).then((results) => {
    let user = results[0];
    // let referral = results[1].tree;
    res.render("user/addfunds", {
      user: user,
      type: "",
      heading: "",
      message: "",
      // referral: referral,
    });
  });
  //         .catch();
};
// Add Funds
exports.addfunds = (req, res) => {
  let username = req.params.username;
  let { pin } = req.body;
  let query = [
    User.findOne({ username }),
    // Referral.findOne({ "tree.username": username }),
    Epin.findOne({ pin, status: "false" }),
  ];

  Promise.all(query)
    .then((results) => {
      let user = results[0];
      let ePin = results[1];
      // let referral = results[1].tree;
      if (!ePin) {
        res.render("user/addfunds", {
          user: user,
          type: "danger",
          heading: "Invalid PIN",
          message: "The pin you entered is invalid!",
          // referral: referral,
        });
      } 
        User.updateOne(
            { username },
            { $inc: { accountbal: ePin.value } },
            (err, result) => {
              if (err) {
                res.render("user/addfunds", {
                  user: user,
                  type: "danger",
                  heading: "Something Went wrong ...",
                  message: err,
                  // referral: referral,
                });
              }
              res.render("user/addfunds", {
                user: user,
                type: "success",
                heading: "Deposit Successful",
                message: "Funds has been successfully added to your account.",
                // referral: referral,
              });
            }
          );
    })
    .catch();
};
