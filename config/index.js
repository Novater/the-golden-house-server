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
    credentials: true,
    preflightContinue: true,
  },
  SESSION_AGE: 1200000
};
