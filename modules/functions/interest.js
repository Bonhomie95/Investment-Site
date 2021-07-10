const moment = require('moment');
const cron = require('node-cron');

const { User, Investment } = require('../database/models');

module.exports = {
    // interest: cron.schedule('* * * * *', function () {
        interest: cron.schedule('00 00 * * 0-6', function () {
        let queries = [
            Investment.find({ status: "Active" }),
        ];
        Promise.all(queries)
            .then(results => {
                let investments = results[0];
                investments.forEach((investment) => {
                    let date = moment().unix();
                    let counter = investment.counter;
                    let username = investment.username;
                    let plan = investment.plan;
                    let roi = investment.roi;
                    function processInterest(username, roi) {
                        User.updateOne({ username }, { $inc: { roi_earning: roi } }, (err, result) => {
                        Investment.updateOne({ username: username }, { $inc: { counter: 1 } }, (err, result) => {
                            })
                        })
                    };
                    let Month1 = moment(investment.start_date).add(1, 'month').unix();
                    let Month2 = moment(investment.start_date).add(2, 'month').unix();
                    let Month3 = moment(investment.start_date).add(3, 'month').unix();
                    let Month4 = moment(investment.start_date).add(4, 'month').unix();
                    let Month5 = moment(investment.start_date).add(5, 'month').unix();
                    let Month6 = moment(investment.start_date).add(6, 'month').unix();
                    let Month7 = moment(investment.start_date).add(7, 'month').unix();
                    let Month8 = moment(investment.start_date).add(8, 'month').unix();
                    let Month9 = moment(investment.start_date).add(9, 'month').unix();
                    let Month10 = moment(investment.start_date).add(10, 'month').unix();
                    let Month11 = moment(investment.start_date).add(11, 'month').unix();
                    let Month12 = moment(investment.start_date).add(12, 'month').unix();

                    if (date >= Month1 && counter == 0) {
                        processInterest(username, roi);

                    } if (date >= Month2 && counter == 1) {
                        processInterest(username, roi);

                    } if (date >= Month3 && counter == 2) {
                        processInterest(username, roi);

                    } if (date >= Month4 && counter == 3) {
                        processInterest(username, roi);

                    } if (date >= Month5 && counter == 4) {
                        processInterest(username, roi);

                    } if (date >= Month6 && counter == 5) {
                        processInterest(username, roi);

                    } if (date >= Month7 && counter == 6 ) {
                        processInterest(username, roi);

                    } if (date >= Month8 && counter == 7 ) {
                        processInterest(username, roi);

                    } if (date >= Month9 && counter == 8 ) {
                        processInterest(username, roi);
                    } if (date >= Month10 && counter == 9 ) {
                        processInterest(username, roi);
                    } if (date >= Month11 && counter == 10 ) {
                        processInterest(username, roi);

                    } if (date >= Month12 && counter == 11 ) {
                        processInterest(username, roi);

                    } 
                })
            })
    })
}