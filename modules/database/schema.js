const mongoose = require('mongoose');

module.exports = {
    //<!--- User Schemas --->
    //User Account
    userSchema: new mongoose.Schema({
        firstname: { type: String, trim: true },
        lastname: { type: String, trim: true },
        username: { type: String, trim: true, unique: true, lowercase: true },
        email: { type: String, trim: true, lowercase: true },
        pin: { type: Number, trim: true },
        password: { type: String, trim: true },
        accountbal: { type: Number, trim: true },
        phonenumber: { type: String, trim: true },
        bankname: { type: String, trim: true },
        accountname: { type: String, trim: true },
        banknumber: { type: String, trim: true },
        address: { type: String, trim: true },
        dateofbirth: { type: String, trim: true },
        referral: { type: String, trim: true },
        referred_count: { type: Number, trim: true },
        referral_earning: { type: Number, trim: true },
        roi_earning: { type: Number, trim: true },
        ppv: { type: Number, trim: true },
        dpv: { type: Number, trim: true },
        status:{default:0, type:Number}
        // ipv: { type: Number, trim: true },
    }),
    //Investment Details Schema
    investmentSchema: new mongoose.Schema({
        order_id: { type: String, trim: true },
        username: { type: String, trim: true, lowercase: true},
        plan: { type: String, trim: true },
        tenure: { type: Number, trim: true },
        rate: { type: String, trim: true },
        amount: { type: Number, trim: true },
        roi: { type: Number, trim: true },
        // monthly_roi:{type:Number},
        counter:{type:Number},
        start_date: { type: Date },
        end_date: { type: Date },
        status: { type: String, trim: true },
    }),
    //Referral Schema
    // referralSchema: new mongoose.Schema({
    //     username: { type: String, trim: true, lowercase:true },
    //     tree: { type: Array },
    //     rank1: Boolean,
    //     rank2: Boolean,
    //     rank3: Boolean,
    //     rank4: Boolean,
    //     rank5: Boolean,
    // }),

    //Withdraw Schema
    withdrawalSchema: new mongoose.Schema({
        userid: { type: String, trim: true },
        order_id: { type: String, trim: true},
        trx_account: { type: String, trim: true },
        amount: { type: Number, trim: true },
        bank_name: { type: String, trim: true },
        account_name: { type: String, trim: true },
        account_no: { type: Number, trim: true },
        status: { type: String, trim: true },
        submitted: { type: Date },
        approved: { type: Date },
    }),

    //<!--- Admin Schemas --->
    //Admin
    adminSchema: new mongoose.Schema({
        userid: { type: String, trim: true },
        password: { type: String, trim: true },
        pin: { type: Number, trim: true }
    }),

    //Create Epins
    epinSchema: new mongoose.Schema({
        pin: { type: Number, trim: true },
        value: { type: Number, trim: true },
        status: { type: Boolean, trim: true },
        user: { type: String, trim: true },
    },{timestamps:true})
}