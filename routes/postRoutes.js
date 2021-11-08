const express = require('express');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const postRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');
const { authUser } = require('../auth/utils');

const ObjectId = require('mongodb').ObjectId;

postRoutes.route('/post/:name').get((req, res) => {
  const { name } = req.params;
  let db_connect = dbo.getDb('content');
  let query = { tabname: name };
  db_connect
    .collection('post')
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    });
});

postRoutes.route('/post/delete').post(authUser, (req, res) => {
  const id = ObjectId(req.body.id);
  let db_connect = dbo.getDb('content');

  let query = {
    _id: id,
  };

  db_connect.collection('post').deleteOne(query, (err, result) => {
    if (err) throw err;
    console.log(`Document ${id} deleted.`);
    console.log('result', result);
    res.json(result);
  });
});

postRoutes.route('/post/update').post(authUser, (req, res) => {
  const id = ObjectId(req.body.id);
  const { title, content } = req.body;
  let db_connect = dbo.getDb('content');

  let query = {
    _id: id,
  };
  let updatedDoc = {
    title,
    content,
  };

  db_connect
    .collection('post')
    .updateOne(query, { $set: updatedDoc })
    .then((res) => {
      console.log('result', res);
    })
    .catch((err) => {
      console.log(err);
    });
});

postRoutes.route('/post/create').post(authUser, (req, res) => {
  const { tabname, index } = req.body;
  let db_connect = dbo.getDb('content');

  let newDoc = {
    title: 'New Post',
    content: 'New Post Content',
    tabname,
  };

  db_connect.collection('post').insertOne(newDoc, (err, result) => {
    if (err) throw err;

    console.log('result', result);
    res.json(result);
  });
});

module.exports = postRoutes;
