// const { User, Referral, Investment } = require('../database/models');
// const cron = require('node-cron');
// module.exports = {
//     // '0 */30 * * * *'
//     indirectpv: cron.schedule('00 03 * * 0-6', function () {
//         User.find({ referral: "" }, (err, lists) => {
//             if (err) throw new Error(err);
//             var list = [];
//             lists.forEach((element) => {
//                 list.push(element.username);
//             });
//             var parents = list;
//             Referral.find({ username: { $in: parents } }, (err, chains) => {
//                 if (err) throw new Error(err);
//                 chains.forEach((chain) => {
//                     if (chain.tree.length <= 1) {
//                     }
//                     else {
//                         //First Generation
//                         //Second Generation
//                         if (chain.rank1 == true && chain.rank2 == false && chain.tree.length >= 14) {
//                             var children = chain.tree.slice(0, 14);
//                             var parent2 = chain.tree.slice(0, 3);
//                             Investment.find({ username: { $in: children } }, (err, results) => {
//                                 if (err) throw new Error(err);
//                                 if (results.length < children.length) {
//                                 }
//                                 else if (results.length == children.length) {
//                                     var calc = (results[7].amount + results[8].amount + results[9].amount + results[10].amount +
//                                         results[11].amount + results[12].amount + results[13].amount + results[14].amount
//                                     ) * 0.05;
//                                     var point = Math.floor(calc);
//                                     User.updateMany({ username: { $in: parent2 } }, { $inc: { ipv: point } }, (err) => {
//                                         if (err) throw new Error(err);
//                                         Referral.updateOne({ username: parents }, { rank2: true }, (err) => {
//                                             if (err) throw new Error(err);
//                                         })
//                                     });
//                                 }
//                             })
//                         }
//                         //Third Generation
//                         if (chain.rank2 == true && chain.rank3 == false && chain.tree.length >= 30) {
//                             var children = chain.tree.slice(0, 30);
//                             var parent3 = chain.tree.slice(0, 7);
//                             Investment.find({ username: { $in: children } }, (err, results) => {
//                                 if (err) throw new Error(err);
//                                 if (results.length < children.length) {
//                                 }
//                                 else if (results.length == children.length) {
//                                     var calc = (results[15].amount + results[16].amount + results[17].amount + results[18].amount +
//                                         results[19].amount + results[20].amount + results[21].amount + results[22].amount +
//                                         results[23].amount + results[24].amount + results[25].amount + results[26].amount +
//                                         results[27].amount + results[28].amount + results[29].amount + results[30].amount
//                                     ) * 0.02;
//                                     var point = Math.floor(calc);
//                                     User.updateMany({ username: { $in: parent3 } }, { $inc: { ipv: point } }, (err) => {
//                                         if (err) throw new Error(err);
//                                         Referral.updateOne({ username: parents }, { rank3: true }, (err) => {
//                                             if (err) throw new Error(err);
//                                         })
//                                     });
//                                 }
//                             })
//                         }
//                         // Fourth Generation
//                         if (chain.rank3 == true && chain.rank4 == false && chain.tree.length >= 62) {
//                             var children = chain.tree.slice(0, 62);
//                             var parent4 = chain.tree.slice(0, 15);
//                             Investment.find({ username: { $in: children } }, (err, results) => {
//                                 if (err) throw new Error(err);
//                                 if (results.length < children.length) {
//                                 }
//                                 else if (results.length == children.length) {
//                                     var calc = (results[31].amount + results[32].amount + results[33].amount + results[34].amount +
//                                         results[35].amount + results[36].amount + results[37].amount + results[38].amount +
//                                         results[39].amount + results[40].amount + results[41].amount + results[42].amount +
//                                         results[43].amount + results[44].amount + results[45].amount + results[46].amount +
//                                         results[47].amount + results[48].amount + results[49].amount + results[50].amount +
//                                         results[61].amount + results[62].amount
//                                     ) * 0.02;
//                                     var point = Math.floor(calc);
//                                     User.updateMany({ username: { $in: parent4 } }, { $inc: { ipv: point } }, (err) => {
//                                         if (err) throw new Error(err);
//                                         Referral.updateOne({ username: parents }, { rank4: true }, (err) => {
//                                             if (err) throw new Error(err);
//                                         })
//                                     });
//                                 }
//                             })
//                         }
                    
//                     }
//                 })
//             })
//         })
//     })
// }