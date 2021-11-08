const express = require('express');
const _ = require('lodash');
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const postRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');
const { authUser } = require('../auth/utils');
const postFunctions = require('../functions/postFunctions');

const ObjectId = require('mongodb').ObjectId;

postRoutes.route('/post/:name').get(async (req, res) => {
  const { name } = req.params;

  try {
    const posts = await postFunctions.getPostsInOrder(name);
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});

postRoutes.route('/post/delete').post(authUser, async (req, res) => {
  try {
    const originPost = await postFunctions.findPostById(req.body.id);
    const deletePost = await postFunctions.deletePost(originPost);
    res.json(deletePost);
  } catch (error) {
    res.json(error);
  }
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

postRoutes.route('/post/create').post(authUser, async (req, res) => {
  const { tabname, index } = req.body;
  const indexParse = index.split('-');
  const position = indexParse[0];
  const originId = indexParse[1];

  let db_connect = dbo.getDb('content');

  let newDoc = {
    title: 'New Post',
    content: 'This is a blank post.',
    tabname,
    prev: null,
    next: null,
  };

  try {
    if (originId) {
      console.log('originId', originId);
      console.log('position', position);
      const originPost = await postFunctions.findPostById(originId);
      const response = await postFunctions.insertNewPost(originPost, newDoc, position);
      res.json(response);
    } else {
      const result = db_connect.collection('post').insertOne(newDoc);
      res.json(result);
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

module.exports = postRoutes;
