const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { User, Epin, Investment } = require("../modules/database/models");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "rsglobal.com.ng",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "admin@rsglobal.com.ng",
    pass: "K-IBWROUZXIl",
  },
});
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.serializeUser());
//Login to  account
exports.signin = async (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }).exec((err, user) => {
    if (err) {
      res.render("auths/login", {
        type: "danger",
        heading: "Invalid Login Details",
        message: "Username does not exist!",
      });
    } else if (!user) {
      res.render("auths/login", {
        type: "danger",
        heading: "Invalid Login Details",
        message: "Username does not exist!",
      });
    } else {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result === false) {
            res.render("auths/login", {
              type: "danger",
              heading: "Invalid Login Details",
              message: "You have entered an incorrect password!",
            });
          } else if (result === true) {
            res.redirect("/dashboard?user=" + username);
          }
        });
      }
    }
  });
};

// Signup a new account
exports.signup = async (req, res) => {
  User.findOne({ username: req.body.username }).exec((err, user) => {
    if (err) res.json({ messages: err });
    if (user) {
      res.render("auths/register", {
        referral: null,
        type: "danger",
        heading: "User Validation",
        message:
          "Username Already Exists! Kindly provide a different username!!",
      });
    } else {
      Epin.findOne({ pin: req.body.epin }).exec((err, pin) => {
        if (err) res.json({ messages: err });
        else if (!pin) {
          res.render("auths/register", {
            referral: null,
            type: "danger",
            heading: "Pin Validation",
            message:
              "Invalid Pin! Please check the pin and try again or contact the Admin for a new pin.",
          });
        }
        //Pin Status: True for Used, False for unused
        else if (pin.status === true) {
          res.render("auths/register", {
            referral: null,
            type: "danger",
            heading: "Pin Validation",
            message:
              "Pin has already been used! Contact the Admin for a new pin.",
          });
        } else if (pin.status === false) {
          const value = pin.value;
          const {
            fname,
            lname,
            username,
            email,
            tpin,
            password,
            referral,
          } = req.body;
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) throw new Error(err);
            else {
              Epin.updateOne(
                { pin: req.body.epin },
                { status: true, user: username },
                (err) => {
                  if (err) throw new Error(err);
                  else {
                    const token = jwt.sign(
                      {
                        fname,
                        lname,
                        username,
                        email,
                        tpin,
                        hashedPassword,
                        value,
                        referral,
                      },
                      process.env.jwt_key,
                      { expiresIn: "5m" }
                    );
                    console.log(req.body, token);
                    // const link = "https://app.rsglobal.com.ng/activate/" + token;
                    // const link = "https://young-refuge-55945.herokuapp.com/activate/" + token;
                    const link = "http://localhost:3000/activate/" + token;
                    const mailOptions = {
                      from: '"noreply", admin@rsglobal.com.ng',
                      to: email,
                      subject: "RSGLOBAL Account Activation",
                      html: `
                                                <p style="margin-bottom: 10px;"><b>Hi ${fname}</b></p>
                                                <p style="margin-bottom: 10px;">Welcome! <br> You are receiving this email because you have registered on our site.</p>
                                                <p style="margin-bottom: 25px;">This link will expire in 5 minutes and can only be used once.</p>
                                                <p style="margin-bottom: 10px;">Click <a href="${link}">here</a> link below to active your RsGlobal account.</p><br>
                                                <p style="margin: 0; font-size: 13px; line-height: 22px; color:#9ea8bb;">This is an automatically generated email please do not reply to this email. If you face any issues, please contact us at  support@rsglobal.com</p>

                                            `,
                    };
                    transporter.sendMail(mailOptions, function (err, info) {
                      if (err) res.render(err);
                      else res.render("auths/success");
                    });
                  }
                }
              );
            }
          });
        }
      });
    }
  });
};

//Return to Dashboard
exports.dashboard = (req, res) => {
  const userid = req.query.user;
  // if(req.isAuthenticated()){
  User.findOne({ username: userid }).exec((err, user) => {
    if (err) throw new Error(err);
    else {
      Investment.findOne({ username: userid }).exec((err, invest) => {
        if (err) throw new Error(err);
        if (!invest || invest.status == "Inactive") {
          res.render("user/dashboard", {
            user: user,
            invest: null,
            type: "",
            heading: "",
            message: "",
          });
        } else {
          res.render("user/dashboard", {
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
  // }else{
  // res.redirect('/login');
  // }
};

//Activate new account
exports.activate = (req, res) => {
  const { token } = req.params;
  if (token) {
    jwt.verify(token, process.env.jwt_key, function (err, decodedToken) {
      if (err) {
        return res.status(400).json({
          error:
            "The activation link has expired. Kindly go back to the previous page, resubmit the form and check your email ASAP!",
        });
      } else {
        const {
          lname,
          fname,
          username,
          email,
          tpin,
          hashedPassword,
          value,
          referral,
        } = decodedToken;
        const user = new User({
          firstname: fname,
          lastname: lname,
          username: username,
          email: email,
          pin: tpin,
          ppv: 0,
          ipv: 0,
          password: hashedPassword,
          accountbal: value,
          referral: referral,
          referral_earning: 0,
          dpv: 0,
          roi_earning: 0,
        });
        user.save(function (err) {
          if (err) throw err;
          else {
            User.updateOne(
              { username: referral },
              { $inc: { referred_count: 1 } },
              function (err) {
                if (err) {
                  return res
                    .status(400)
                    .json({ messages: "Error Activating Account!" });
                }
                req.session.userID = user.id;
                res.render("auths/login", {
                  type: "",
                  heading: "",
                  message: "",
                });
              }
            );
          }
        });
      }
    });
  } else {
    return res.json({ error: "Something Went Wrong!!!" });
  }
};

//Referral signup
exports.referral = (req, res) => {
  User.findOne({ _id: req.params.referralid }, (err, user) => {
    if (err) throw new Error(err);
    else {
      const referral = user.username;
      res.render("auths/register", {
        referral: referral,
        type: "",
        heading: "",
        message: "",
      });
    }
  });
};

//Forgot Password
exports.forgetpassword = (req, res) => {
  const { username, email } = req.body;
  User.findOne({ username }).exec((err, user) => {
    if (err) new Error(err);
    if (!user) {
      res.status(400).json({
        messages:
          "No user was found with the details provided! Kindly confirm you entered the correct details and try again.",
      });
    } else {
      var new_password = Math.floor(Math.random() * 900000) + 100000;
      User.updateOne(
        { username: username },
        { password: new_password },
        (err) => {
          if (err) throw new Error(err);
          const mailOptions = {
            from: "'noreply',admin@rsglobal.com",
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
            if (err) res.render(err);
            res.render("auths/reset-success");
          });
        }
      );
    }
  });
};

//Sign Out of Account
exports.signout = (req, res) => {
  res.session = null;
  res.render("auths/login", {
    type: "",
    heading: "",
    message: "",
  });
};
