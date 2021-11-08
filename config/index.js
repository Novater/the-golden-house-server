module.exports = {
  ROLES: {
    ADMIN: 'ADMIN',
    EDITOR: 'EDITOR',
  },
  CORS_DEFAULT_CONFIG: {
    origin: [
      'http://localhost:3000',
      'https://afternoon-dusk-78000.herokuapp.com',
    ],
    // origin: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    methods: 'GET,POST',
    credentials: true,
    preflightContinue: true,
  },
  SESSION_AGE: 600000
};
