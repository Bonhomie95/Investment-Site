const express = require('express');
const jwt = require("jsonwebtoken");
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const { signin, activate, referral, forgetpassword, signup, signout, dashboard } = require('../controllers/auth');
const { referrals_list } = require('../controllers/referral');
const { Epin } = require('../modules/database/models');
//app
const app = express();

//Passport Config
// passport.use(new localStrategy(function (username, password, done) {
//     if (username === process.env.admin_name && password === process.env.admin_pass) {
//         done(null, {
//             username: username
//         });
//     } else {
//         done(null, false);
//     }
// }));
// passport.serializeUser(function (user, done) {
//     done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//     done(null, user);
// });

//Routers
//<== Auth Routes ==>
app.route('/login')
    .get((req, res) => {
        res.render('auths/login', {
            type: "",
            heading: "",
            message: ""
        });
    })
    .post(signin);
    
app.route('/')
    .get((req, res) => {
        res.render('auths/login', {
            type: "",
            heading: "",
            message: ""
        });
    })
//Dashboard
app.route('/dashboard')
    .get(dashboard);

app.route('/register')
    .get((req, res) => {
        res.render('auths/register', {
            referral: null, type: "",
            heading: "",
            message: ""
        });
    })
    .post(signup);

// app.get('/account/:username', dashboard_logged);

app.get('/register/:referralid', referral);

app.get('/activate/:token', activate);

app.route('/forgot-password')
    .get((req, res) => {
        res.render('auths/reset',{
            type: "",
            heading: "",
            message: ""
        });
    })
    .post(forgetpassword);

app.get('/logout', signout);

app.get('/referral/:username', referrals_list);
module.exports = app;