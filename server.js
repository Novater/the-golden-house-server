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
const ddos = new Ddos({ burst: 10, limit: 25 });

const { CORS_DEFAULT_CONFIG, SESSION_AGE } = config;
app.enable('trust proxy');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(CORS_DEFAULT_CONFIG));
app.use(ddos.express);

app.use(
  session({
    name: 'session-id',
    secret: process.env.SECRET_COOKIE,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: SESSION_AGE,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : '',
      httpOnly: process.env.NODE_ENV === 'production' ? true : '',
      secure: process.env.NODE_ENV === 'production' ? true : '',
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
passportSetup();

app.use(helmet());
app.use(require('./routes/tableRoutes'));
app.use(require('./routes/postRoutes'));
app.use(require('./routes/pageRoutes'));
app.use(require('./routes/authRoutes'));
app.use(require('./routes/apiRoutes'));

app.listen(port, () => {
  // perform database connection when the server starts
  dbo.connectToServer(process.env.DB_NAME || 'leaderboard', (err) => {
    if (err) console.log(err);
  });

  console.log(`Server is running on port: ${port}`);
});
