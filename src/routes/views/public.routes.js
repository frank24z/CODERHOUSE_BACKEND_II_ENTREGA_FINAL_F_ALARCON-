const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

const passport = require('passport');

router.get('/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.render('profile', req.user);
  }
);

router.get('/my-reservations',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    req.url = '/mine'; // redirige internamente
    require('../api/reservations.routes')(express.Router()).handle(req, res, next);
  }
);


module.exports = router;
