const express = require('express');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

recordRoutes.route('/record').get((req, res) => {
  let db_connect = dbo.getDb('leaderboard');
  db_connect
    .collection('entries')
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

module.exports = recordRoutes;