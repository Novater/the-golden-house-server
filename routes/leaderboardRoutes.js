const express = require('express');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const leaderboardRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');
const { authUser } = require('../auth/utils');

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
      res.send(result[0]);
    });
});

leaderboardRoutes.route('/record/:collection').get((req, res) => {
  const { collection } = req.params;
  console.log(collection);
  let db_connect = dbo.getDb('leaderboard');
  const query = { approved: true };
  db_connect
    .collection(collection)
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.send({ status_code: 200, msg: 'success', data: result });
    });
});

leaderboardRoutes
  .route('/record/:collection/admin')
  .get(authUser, (req, res) => {
    const { collection } = req.params;
    console.log(req.body.user);
    let db_connect = dbo.getDb('leaderboard');
    const query = { approved: { $in: [null, false] } };
    db_connect
      .collection(collection)
      .find(query)
      .toArray((err, result) => {
        if (err) throw err;
        res.json(result);
      });
  });

leaderboardRoutes
  .route('/record/:collection/delete')
  .post(authUser, (req, res) => {
    const { collection } = req.params;
    const records = req.body.records;
    let db_connect = dbo.getDb('leaderboard');
    const recordIds = req.body.records.map((record) => ObjectId(record._id));
    const query = { _id: { $in: recordIds } };
    db_connect.collection(collection).deleteMany(query, (err, result) => {
      if (err) console.log(err);
      res.json(result);
    });
  });

leaderboardRoutes
  .route('/record/:collection/approve')
  .post(authUser, (req, res) => {
    const { collection } = req.params;
    let db_connect = dbo.getDb('leaderboard');
    const recordIds = req.body.records.map((record) => ObjectId(record._id));
    const query = { _id: { $in: recordIds } };
    const updatedDoc = { approved: true };
    db_connect
      .collection(collection)
      .updateMany(query, { $set: updatedDoc })
      .then((res) => {
        console.log('result', res);
      })
      .catch((err) => {
        console.log(err);
      });
  });

module.exports = leaderboardRoutes;
