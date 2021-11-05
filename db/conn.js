const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './config.env' });

const Db = process.env.ATLAS_URI;
console.log(Db);
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbs = {};

module.exports = {
  connectToServer: (databaseName, callback) => {
    client.connect((err, db) => {
      // Verify we got a good 'db' object
      if (db) {
        dbs['leaderboard'] = db.db('leaderboard');
        dbs['content'] = db.db('content');

        console.log('Successfully connected to MongoDB');
      }

      return callback(err);
    });
  },

  getDb: (dbName) => {
    if (dbName) return db.db(dbs[dbName]);
  },
};
