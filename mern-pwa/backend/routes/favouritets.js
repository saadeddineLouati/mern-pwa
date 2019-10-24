const router = require('express').Router();
let favourite = require('../models/favourite');


router.route('/').get((req, res) => {
    favourite.find()
    .then(favourites => res.json(favourites))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;