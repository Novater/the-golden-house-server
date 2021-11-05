const express = require('express');

const pageRoutes = express.Router();

const dbo = require('../;db/conn');


pageRoutes.route('/page').get((req, res) => {
  let db_connect = dbo.getDb('content');
  db_connect
    .collection('page')
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    })
});

module.exports = pageRoutes;
