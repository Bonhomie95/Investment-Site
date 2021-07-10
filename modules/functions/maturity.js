const moment = require('moment');
const cron = require('node-cron');
const { User, Investment } = require('../database/models');

module.exports = {
    // maturity: cron.schedule('00 01 * * 0-6', function () {
        maturity: cron.schedule('* * * * *', function () {
        Investment.find({ status: "Active" }, (err, investments) => {
            investments.forEach((investment) => {
                const currentDate = moment().unix();
                const maturity = moment(investment.end_date).unix();
                const capital = investment.amount;
                if (currentDate >= maturity && investment.status == "Active") {
                    Investment.updateOne({ "username": investment.username }, { status: "Inactive" }, (err) => {
                        User.updateOne({ "username": investment.username }, { $inc: { accountbal: capital } }, (err) => { })
                    })
                }
            })
        })
    })

}