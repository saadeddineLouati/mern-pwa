const router = require('express').Router();
let faq = require('../models/faq');


router.route('/').get((req, res) => {
    faq.find()
    .then(faqs => res.json(faqs))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;