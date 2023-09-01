const express = require('express');
const { ensureGuest, ensureAuth } = require('../middleware/auth');
const router = express.Router();

//@desc Login/Landing page
//@route GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  });
});

//@desc dashboard
//@route GET /
router.get('/dashboard', ensureAuth, (req, res) => {
  res.render('dashboard', {
    name: req.user.firstName,
  });
});

module.exports = router;
