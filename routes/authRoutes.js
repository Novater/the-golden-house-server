const express = require('express');
const authRoutes = express.Router();
const passport = require('passport');
const cors = require('cors');
authRoutes
  .route('/login')
  .post(
    passport.authenticate('local', { failRedirect: '/login/fail' }),
    (req, res) => {
      console.log('req.user', req.user);
      res.send('Login Success');
    },
  );

authRoutes.route('/login/fail').get((req, res) => {
  console.log(req);
  res.send(res);
});

module.exports = authRoutes;
