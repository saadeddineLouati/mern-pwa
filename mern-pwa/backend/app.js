const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require('./models/user');
const flash = require("connect-flash");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());


//const uri = process.env.ATLAS_URI;
mongoose.connect('mongodb://localhost/playItsl', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false  }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true

}));
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(function (User, cb) {
    cb(null, User);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use(flash());

const gamesRouter = require('./routes/games');
const topsRouter = require('./routes/tops');
const newsRouter = require('./routes/new');
const viewRouter = require('./routes/view');
const visitRouter = require('./routes/visit');
const usersRouter = require('./routes/users');
const favouritesRouter = require('./routes/favouritets');

app.use('/games', gamesRouter);
app.use('/tops', topsRouter);
app.use('/news', newsRouter);
app.use('/views', viewRouter);
app.use('/visits', visitRouter);
app.use('/users', usersRouter);
app.use('/favourites', favouritesRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});