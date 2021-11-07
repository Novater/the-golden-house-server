const express = require('express');
const session = require('express-session');
const app = express();

require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const port = process.env.PORT || 8000;
const { passportSetup, checkIsInRole } = require('./auth/utils');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const dbo = require('./db/conn');

app.use(cors({ credentials: true }));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use(
  session({
    name: 'session-id',
    secret: 'keyboard-cat',
    saveUninitialized: false,
    resave: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
passportSetup();

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use(helmet());
app.use(express.json());
app.use(require('./routes/leaderboardRoutes'));
app.use(require('./routes/postRoutes'));
app.use(require('./routes/pageRoutes'));
app.use(require('./routes/authRoutes'));

app.listen(port, () => {
  // perform database connection when the server starts
  dbo.connectToServer(process.env.DB_NAME || 'leaderboard', (err) => {
    if (err) console.log(err);
  });

  console.log(`Server is running on port: ${port}`);
});
