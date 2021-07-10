const express = require('express');
const { signin, authenticate, authenticate1,
    epin, create_epin, show_investments, pending,
    processed, declined, adminlogged, approve, reject, users, withdrawal_details, view_user, suspend_user, activate_user, single_investment, suspend_investment, reactivate_investment, reset_user_password}
    = require('../controllers/admin');

const app = express();

//Sign In
app.route('/rsglobal131220-ControlPanel')
    .get(signin)
    .post(authenticate);

app.get('/rsglobal131220-83764762387592768352742587', adminlogged)

app.post('/rsglobal131220-ControlPanel1', authenticate1);

//Epin
app.route('/131220generate-epin')
    .get(epin)
    .post(create_epin);

//Show Investment
app.route('/rsglobal131220-investments')
    .get(show_investments);

//Withdrawal
//pending withdrawals
app.route('/rsglobal131220-withdrawal')
    .get(pending);

// action
app.get('/rsglobal131220-withdrawal-view/:order_id',withdrawal_details);
app.get("/rsglobal131220-withdrawal-approve/:order_id", approve);
app.get("/rsglobal131220-withdrawal-decline/:order_id", reject);
//processed withdrawals
app.route('/rsglobal131220-processed')
    .get(processed);

//declined withdrawals
app.route('/rsglobal131220-declined')
    .get(declined);

//Manage Users
app.route('/rsglobal131220-allusers')
.get(users);

//View User Details
app.route('/user/:username')
.get(view_user);

//Suspend User
app.route('/suspend/:username')
.get(suspend_user);

//Re-activate User
app.route('/reactivate/:username')
.get(activate_user);

//Show Single Investment
app.route('/investment/:order_id')
.get(single_investment);

//Suspend Investment
app.route('/suspend-investment/:order_id')
.get(suspend_investment);

//Re-activate Investment
app.route('/reactivate-investment/:order_id')
.get(reactivate_investment);

//Reset Password
app.route('/reset_password/:username')
.get(reset_user_password);

module.exports = app;