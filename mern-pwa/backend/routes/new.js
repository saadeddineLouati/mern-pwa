const router = require('express').Router();
let neww = require('../models/new');


router.route('/').get((req, res) => {
    neww.find()
    .then(news => res.json(news))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;