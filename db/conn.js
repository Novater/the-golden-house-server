const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './config.env' });

const Db = process.env.ATLAS_URI;
console.log(Db);
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

module.exports = {
  connectToServer: (databaseName, callback) => {
    client.connect((err, db) => {
      // Verify we got a good 'db' object
      if (db) {
        _db = db.db(databaseName);
        console.log('Successfully connected to MongoDB');
      }

      return callback(err);
    });
  },

  getDb: (dbName) => {
    if (dbName) return db.db(dbName);
    return _db;
  },
};
