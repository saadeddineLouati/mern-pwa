const router = require('express').Router();
const passport = require("passport");
let user = require('../models/user');

router.route('/').get((req, res) => {
    user.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/subscription').post((req, res) => {
    var newUser = new user({
        username: req.body.username,
        fullname: req.body.fullname,
        number: req.body.number,
        gender: req.body.gender,
        email: req.body.email,
        nationality: req.body.nationality,
        subsType: req.body.subsType,
        renwable: req.body.renwable,
        picture: "user_1.jpg",
        admin: "false"
    });

    user.register(newUser, req.body.password)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/connect').post(
    passport.authenticate("local",
    {
        successRedirect: "/account",
        failureRedirect: "/signIn"
    }), function (res, req) {
    }
);

router.route('/account, isLoggedIn').get((req, res) => {
    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
      }
    if (!localStorage.getItem('link')) {
        User.findById(req.user._id).populate("favourites").exec(function (err, user) {
            if (err) {
                console.log(err);
            } else {
                req.session.previousUrl='/account';
                res.render("account", {user: user,flash: {error:req.flash('error'), success:req.flash('success')}});
            }
        });
      }else{
        var prev=localStorage.getItem('link');
        localStorage.clear();
        localStorage===null;
        res.redirect(prev);
      }
});

module.exports = router;