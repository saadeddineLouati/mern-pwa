const router = require('express').Router();
let view = require('../models/view');


router.route('/').get((req, res) => {
    view.find()
    .then(views => res.json(views))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;