const express = require('express');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const leaderboardRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

const ObjectId = require('mongodb').ObjectId;

leaderboardRoutes.route('/table/:tableName').get((req, res) => {
  const { tableName } = req.params;
  let db_connect = dbo.getDb('leaderboard');
  const query = { tablename: tableName };
  db_connect
    .collection('table')
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.json(result[0]);
    });
});

leaderboardRoutes.route('/record/:collection').get((req, res) => {
  const { collection } = req.params;
  let db_connect = dbo.getDb('leaderboard');
  db_connect
    .collection(collection)
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

leaderboardRoutes.route('/record/:collection/delete/:id').post((req, res) => {
  const { collection, id } = req.params;
  let db_connect = dbo.getDb('leaderboard');
  console.log('deleting id ' + id)
  const query = { _id: id };
  db_connect
    .collection(collection)
    .deleteOne(query, (err, result) => {
      if (err) console.log(err)
      res.json(result)
    })
});

module.exports = leaderboardRoutes;
