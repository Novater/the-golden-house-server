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

postRoutes.route('/post/:tab').get(async (req, res) => {
  const { tab } = req.params;

  try {
    const { data } = await postFunctions.findPostsByPage(tab);
    console.log('data', data);
    const structuredPosts = postFunctions.convert1Dto2DPostArray(data);
    console.log('structuredPosts', structuredPosts);
    res.json(structuredPosts);
  } catch (error) {
    res.json(error);
  }
});

postRoutes.route('/post/submit').post(authUser, async (req, res) => {
  const id = ObjectId(req.body.id);
  const { posts, tab } = req.body;
  let db_connect = dbo.getDb('content');
  const { data } = await postFunctions.findPostsByPage(tab);
  console.log('data', data);
  const deleteManyObj = postFunctions.getDeleteManyObj(data);

  console.log('deleteManyObj', deleteManyObj);
  console.log('posts', posts);
  let deleteFailed = false;
  let insertFailed = false;

  // Saga 1 : Perform delete operation
  try {
    const deleteRes = await db_connect
      .collection('post')
      .deleteMany({ _id: { $in: deleteManyObj } });
  } catch (error) {
    console.log(error);
    deleteFailed = true;
  }

  // Saga 2 : Perform insert operation
  try {
    const posts1DArr = postFunctions.destructure2DArrayTo1DWithIndexing(
      posts,
      tab,
    );
    const insertRes = await db_connect
      .collection('post')
      .insertMany(posts1DArr);
  } catch (error) {
    console.log(error);
    insertFailed = true;
  }

  if (insertFailed || deleteFailed) {
    postFunctions.rollbackBulkDeleteWrite({
      deleteFailed,
      insertFailed,
      posts,
      tab,
    });
    res.json({ status_code: 400, msg: 'Error' });
  } else {
    res.json({ status_code: 200, msg: 'Success' });
  }
});

module.exports = postRoutes;
