const router = require('express').Router();
const passport = require("passport");
let user = require('../models/user');
const LocalStorage = require('node-localstorage').LocalStorage;
const  multer = require("multer");
const    async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");


// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './static/usersPhotos/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + username.sync() + '-' + file.originalname);
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 4 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

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
    passport.authenticate("local"), function (req, res) {
        console.log('logged in', req.user);
        var userInfo = {
            username: req.user.username
        };
        res.send(userInfo);
    }
);

router.route('/account').get(isLoggedIn,(req, res) => {
    user.findById(req.user._id).populate("favourites")
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));

});

router.route('/upload').post((req, res) => {
    upload(req, res, (err) => {
        if (err) {
            user.findById(req.user._id).populate("favourites").exec(function (err, user) {
                if (err) {
                    res.status(400).json('Error: ' + err);
                } else {
                    res.json({message: "Oups ! Something wrong, try again please..."});
                }
            });
        } else {
            if (req.file == undefined) {
                user.findById(req.user._id).populate("favourites").exec(function (err, user) {
                    if (err) {
                        res.status(400).json('Error: ' + err);
                    } else {
                        res.json({message: "Error: No File Selected!"});
                    }
                });
            } else {
                user.findByIdAndUpdate(req.user._id, { picture: req.file.fieldname + '-' + username.sync() + '-' + req.file.originalname }, { new: true }, function (err, user) {
                    if (err) {
                        res.status(400).json('Error: ' + err);
                    } else {
                        req.user.picture = req.file.fieldname + '-' + username.sync() + '-' + req.file.originalname;
                        User.findById(req.user._id).populate("favourites").exec(function (err, user) {
                            if (err) {
                                res.status(400).json('Error: ' + err);
                            } else {
                                res.json({message: 'Congrats: file uploaded succefully' + user.picture});
                            }
                        });                    }
                });
            }
        }
    });
});

router.route('/forgot').post((req, res, next) => {
    let message;
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            user.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    res.json({message: 'No account with that email address exists.'});
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'galactechstudio@gmail.com',
                    pass: 'Galactech.2019'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'galactechstudio@gmail.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('mail sent');
                message={
                    message: 'An e-mail has been sent to ' + user.email + ' with further instructions.'
                }
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.json(message);
    });
});

router.route('/reset/:token').get((req, res) => {
    user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            return res.json({message : 'Password reset token is invalid or has expired.'})
        }
       // res.render('reset', { token: req.params.token, flash: {error:req.flash('error'), success:req.flash('success')} });
        res.json(token);
    });
});

router.route('/reset/:token').post((req, res) => {
    async.waterfall([
        function (done) {
            user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    return res.json({message: 'Password reset token is invalid or has expired.'});
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function (err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function (err) {
                            req.logIn(user, function (err) {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    return res.json({message: 'Passwords do not match.'});
                }
            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'galactechstudio@gmail.com',
                    pass: 'Galactech.2019'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'galactechstudio@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function (err) {
        res.json({message: 'error'});
    });
});

router.route('/logout').get((req, res) => {
    req.logOut();
    res.json({message: 'logged out'});
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json({message: 'u have to login first'});
}
module.exports = router;