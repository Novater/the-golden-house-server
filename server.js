require('dotenv').config();

const express = require('express');
const app = express();
const session = require('express-session');
const helmet = require('helmet');
const passport = require('passport');

const port = process.env.PORT || 8000;
const dbo = require('./db/conn');
const config = require('./config');
const { passportSetup } = require('./auth/utils');
const cors = require('cors');
const Ddos = require('ddos');
const ddos = new Ddos({ burst: 10, limit: 15 });

const { CORS_DEFAULT_CONFIG, SESSION_AGE } = config;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(CORS_DEFAULT_CONFIG));
app.use(ddos.express);
app.set('trust proxy', 1);
app.use(
  session({
    name: 'session-id',
    secret: 'keyboard-cat',
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: SESSION_AGE },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
passportSetup();

app.use(helmet());
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
