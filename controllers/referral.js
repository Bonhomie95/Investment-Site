const { User } = require("../modules/database/models");

exports.referrals_list = (req,res) => {

    const username = req.params.username;
    User.findOne({username:username},(err,user)=>{
        if(err) throw new Error(err);
        else{
            User.find({ referral: username }, (err, referrals) => {
                if (err) throw new Error(err);
                else {
                    res.render('user/referral', {user:user, referrals: referrals });
                }
            })
        }
    });
};