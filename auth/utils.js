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
          if (err) return done(err, null);
          if (!user)
            return done(null, false, { message: 'Username does not exist' });
          if (!verifyPassword(password, user.password))
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
    try {
      const user = ObjectId(id);
      let db_connect = dbo.getDb('auth');
      const query = { _id: user };
      db_connect.collection('user').findOne(query, (err, dbUser) => {
        if (err) return done(err, null);
        return done(null, dbUser);
      });
    } catch (err) {
      return done(err, null);
    }
  });
};

const verifyPassword = (candidate, actual) => {
  return bcrypt.compareSync(candidate, actual);
};

const authUser = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  res.status(401).json('Not Authenticated.')
}

module.exports = { passportSetup, authUser };
