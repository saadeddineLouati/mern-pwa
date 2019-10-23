const router = require('express').Router();
let game = require('../models/game');


router.route('/').get((req, res) => {
    game.find()
    .then(games => res.json(games))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;