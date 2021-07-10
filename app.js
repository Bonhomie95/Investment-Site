//jshint esversion:6

// <!-- Imports -->
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');


require('./modules/database/connect');
const app = express();


// <!-- Middlewares -->
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));
app.set('view engine', 'ejs');

//Passport Setup
app.use(session({
    secret:process.env.key,
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());


// <!--Routes Modules -->
const authroutes = require('./routes/auth');
const investroutes = require('./routes/invest');
const profileroutes = require('./routes/profile');
const withdrawroutes = require('./routes/withdrawal');
const adminroutes = require('./routes/admin');

// <!--Routes -->
app.use(authroutes);
app.use(investroutes);
app.use(profileroutes);
app.use(withdrawroutes);
app.use(adminroutes);

//Invalid Route
app.get('*',(req,res)=>{
    res.render('404');
})
//CRON JOBS
require('./modules/functions/maturity');
// require('./modules/functions/indirectpv');
require('./modules/functions/interest');

app.listen(process.env.PORT || 3005, function () {
    console.log("Server started on port 3005:")
});