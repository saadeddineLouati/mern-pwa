const router = require('express').Router();
let game = require('../models/game');
let Comment = require('../models/comment');
let View = require('../models/view');
let Visit = require('../models/visit');
let User = require('../models/user');



router.route('/').get((req, res) => {
    game.find()
    .then(games => res.json(games))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
        game.findById(req.params.id).populate({ path: 'comments', populate: { path: 'author' } }).exec(function (err, game) {
        if (err) {
            res.status(400).json('Error: ' + err);
        } else {
            var userId;
            if (req.user) {
                userId = req.user._id;
            } else {
                userId = "5d4ac8e298ddcb3c09b1b2a9";
            }
            View.create({ author: userId, game: req.params.id }, function (err, View) {
                if (err) {
                    res.status(400).json('Error: ' + err);
                } else {
                    View.save();
                    req.session.previousUrl='/games/'+req.params.id;
                    res.json(game);
                }
            });

        }
    });
});

router.route('/play/:id').get((req, res) => {
    game.findById(req.params.id, function (err, game) {
        if (err) {
            res.status(400).json('Error: ' + err);
        } else {
            var username = req.user.username;
            var userId = req.user._id;
            Visit.create({ author: userId, username: username, game: req.params.id }, function (err, Visit) {
                if (err) {
                    res.status(400).json('Error: ' + err);
            } else {
                    Visit.save();
                    req.session.previousUrl='/play/'+req.params.id;
                    res.json(game);
                }
            });
        }
    });
});

router.route('/:id/comments').get((req, res) => {
    game.findById(req.params.id, function (err, game) {
        if (err) {
            res.status(400).json('Error: ' + err);
        } else {
            Comment.create({ text: req.body.comment, author: req.user._id }, function (err, Comment) {
                if (err) {
                    console.log(err);
                } else {
                    game.comments.push(Comment);
                    game.save();
                    res.json(Comment);
                }
            });
        }
    });
});

router.route('/addToFav/:id').get((req, res) => {
    User.findById(req.user._id, function (err, User) {
        if (err) {
            res.status(400).json('Error: ' + err);
        } else {
            req.user.favourites.push(req.params.id);
            User.favourites.push(req.params.id);
            User.save();
            res.json(User);
        }
    }
    );
});

router.route('/removefav/:id').get((req, res) => {
    User.findById(req.user._id, function (err, User) {
        if (err) {
            res.status(400).json('Error: ' + err);
        } else {
            req.user.favourites.splice(User.favourites.indexOf(req.params.id), 1);
            User.favourites.splice(User.favourites.indexOf(req.params.id), 1);
            //User.favourites.push(req.params.id);
            User.save();
            res.json(User);
        }
    }
    );
});

router.route('/add').post((req, res) => {
    const title = req.body.title;
    const kind = req.body.kind;
    const studioname = req.body.studioname;
    const prevPublished = req.body.prevPublished;
    const mode = req.body.mode;
    const rating = req.body.rating;
    const grades = req.body.grades;
    const icon = req.body.icon;
    const description = req.body.description;
    const gamelink = req.body.gamelink;
    const trailer = req.body.trailer;
    const image = req.body.image;


  
    const game = new game({
         title,
         kind ,
         studioname,
         prevPublished,
         mode,
         rating,
         grades,
         icon,
         description,
         gamelink,
         trailer,
         image
        });
  
    game.save()
    .then(() => res.json('Game added!'))
    .catch(err => res.status(400).json('Error: ' + err));
  });
module.exports = router;