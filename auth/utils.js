const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// This will help us connect to the database
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;

const passportSetup = () => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      try {
        let db_connect = dbo.getDb('auth');
        const query = { username: username };
        db_connect.collection('user').findOne(query, (err, user) => {
          if (err) console.log(err);
          if (!user)
            return done(null, false, { message: 'Username does not exist' });
          if (!verifyPassword(user.password, password))
            return done(null, false, { message: 'Incorrect password.' });
          return done(null, user);
        });
      } catch (err) {
        return done(err, null);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser((id, done) => {
    console.log('deserializing user', id);
    try {
      const user = ObjectId(id);
      let db_connect = dbo.getDb('auth');
      const query = { _id: user };
      db_connect.collection('user').findOne(query, (err, result) => {
        if (err) console.log(err);
        return done(err, null);
      });
    } catch (err) {
      return done(err, null);
    }
  });
};

const verifyPassword = (candidate, actual) => {
  return bcrypt.compareSync(candidate, actual);
};

const checkIsinRole =
  (...roles) =>
  (req, res, next) => {
    if (req.username) res.redirect('/login');
    const hasRole = roles.find((role) => req.role === role);
    if (!hasRole) {
      return res.redirect('/login');
    }

    return next();
  };

module.exports = { passportSetup, checkIsinRole };
