const router = require('express').Router();
let visit = require('../models/visit');


router.route('/').get((req, res) => {
    visit.find()
    .then(visits => res.json(visits))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;