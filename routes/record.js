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

recordRoutes.route('/post/:name').get((req, res) => {
  const { name } = req.params;
  let db_connect = dbo.getDb('leaderboard');
  let query = { tabname: name }
  db_connect
    .collection('posts')
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

recordRoutes.route('/post/delete').post((req, res) => {
  const id = ObjectId(req.body.id);
  let db_connect = dbo.getDb('leaderboard');

  let query = { 
    _id: id 
  };

  db_connect
    .collection('posts')
    .deleteOne(query, (err, result) => {
      if (err) throw err;
      console.log(`Document ${id} deleted.`);
      console.log('result', result);
      res.json(result);
    });
});

recordRoutes.route('/post/update').post((req, res) => {
  const id = ObjectId(req.body.id);
  const { title, content } = req.body;
  let db_connect = dbo.getDb('leaderboard');

  let query = {
    _id: id
  };
  let updatedDoc = {
    title,
    content
  };

  db_connect
    .collection('posts')
    .updateOne(query, { $set: updatedDoc })
    .then(res => {
      console.log('result', res);
    })
    .catch(err => {
      console.log(err);
    });


});

module.exports = recordRoutes;