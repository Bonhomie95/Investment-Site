const express = require('express');
const { profile, settings, updateprofile, changePassword, changePin, tree, deposit, addfunds } = require("../controllers/profile");
const app = express();

app.route('/profile/:username')
    .get(profile)
    .post(updateprofile);

app.get('/settings/:username', settings)
    
app.post('/change-password/:username',changePassword);

app.post('/change-pin/:username',changePin);

app.route('/deposit/:username')
.get(deposit)
.post(addfunds);

module.exports = app;