// const { check } = require('express-validator');
// const { Epin } = require('../database/models');

// module.exports = {
//     refineFname: check('fname').trim(),
//     refineLname: check('lname').trim(),
//     refineUsername: check('username').trim(),
//     refineEmail: check('email').trim()
//         .normalizeEmail()
//         .isEmail()
//         .withMessage('Must be a Valid Email address'),
//     refineTpin: check('tpin').trim(),
//     refineEpin: check('epin').trim()
//         .custom(async epin => {
//             const existingPin = await Epin.findOne({ pin: epin });
//             if (!existingPin) {
//                 throw new Error('Invalid Pin! The pin you entered does not exist');
//             }
//         }),
//     refinePassword: check('password').trim().isLength({ min: 8, max: 20 }),
// }