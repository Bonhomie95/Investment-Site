const express = require('express');
const { invest, select_plan, process_investment, investments, invest_details } = require('../controllers/invest');
// const { Investment } = require('../modules/database/models');

const app = express();

app.route('/invest/:username')
    .get(invest);

// app.route('/select-plan/:username')
//     .get(select_plan)

app.route('/process-plan')
    .post(process_investment)
    
// Investment History (GET)
app.route('/investments/:username')
.get(investments);

app.route('/investments-details/:username')
    .get(invest_details);

module.exports = app;