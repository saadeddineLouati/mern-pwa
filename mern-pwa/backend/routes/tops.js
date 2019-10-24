const router = require('express').Router();
let top = require('../models/top');


router.route('/').get((req, res) => {
    top.find()
    .then(tops => res.json(tops))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;