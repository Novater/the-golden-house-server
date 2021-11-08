const express = require('express');
const authRoutes = express.Router();
const passport = require('passport');

authRoutes
  .route('/login')
  .post(
    passport.authenticate('local', { failRedirect: '/login/fail' }),
    (req, res) => {
      const { username, role } = req.user;
      res.json({
        id: username,
        role: role,
      });
    },
  );

authRoutes.route('/logout').post((req, res) => {
  req.logout();
  res.send('Logged out.');
});

authRoutes.route('/logged-in').get((req, res) => {
  if (!req.user) {
    res.json({ id: null, role: null });
  } else {
    const { username, role } = req.user;
    res.json({ id: username, role });
  }
});

authRoutes.route('/login/fail').get((req, res) => {
  res.send('Invalid Login.');
});

module.exports = authRoutes;
