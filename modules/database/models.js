const mongoose = require("mongoose");
// const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const { userSchema, epinSchema, investmentSchema, withdrawalSchema, adminSchema } = require('./schema');
userSchema.plugin(passportLocalMongoose)
module.exports = {
    //User
    User: mongoose.model('User', userSchema),
    Investment: mongoose.model('Investment', investmentSchema),
    Withdrawal: mongoose.model('Withdrawal', withdrawalSchema),

    //Admin
    Admin:mongoose.model('Admin',adminSchema),
    Epin: mongoose.model('Epin', epinSchema)
}