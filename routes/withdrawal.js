const express = require('express');
const { withdrawal, withdrawal_request, withdrawal_history, withdrawal_details } = require('../controllers/withdraw');
const app = express();

app.route('/withdrawal/:username')
.get(withdrawal)
.post(withdrawal_request);

app.route('/withdrawal-history/:username')
.get(withdrawal_history);

app.route('/withdrawal-details/:withdraw_id')
.get(withdrawal_details);

module.exports = app;