const { v4: uuidv4 } = require('uuid');

// This will help us connect to the database
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;

class postFunctions {
  static async findPostById(id) {
    let db_connect = dbo.getDb('content');
    try {
      const doc = await db_connect
        .collection('post')
        .findOne({ _id: ObjectId(id) });

      return new Promise((resolve, reject) => {
        resolve(doc);
      });
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject({ msg: 'Error processing.', error });
      });
    }
  }

  static async insertNewPost(originPost, newPost, position) {
    try {
      let db_connect = dbo.getDb('content');
      const newId = new ObjectId();
      newPost._id = newId;
      console.log(newPost);
      const newPostId = newPost._id;

      if (position === 'prev') {
        const queryNewPost = { _id: newPostId };
        const queryOriginPost = { _id: ObjectId(originPost._id) };
        const updateNewPost = {
          next: originPost._id,
          prev: originPost.prev,
        };
        const updateOriginPost = {
          prev: newPostId,
        };

        if (originPost.prev) {
          const queryPrevPost = { _id: ObjectId(originPost.prev) };
          const updatePrevPost = {
            next: newPostId,
          };

          const updates = [
            {
              insertOne: newPost,
              updateOne: {
                filter: queryNewPost,
                update: { $set: updateNewPost },
              },
              updateOne: {
                filter: queryOriginPost,
                update: { $set: updateOriginPost },
              },
              updateOne: {
                filter: queryPrevPost,
                update: { $set: updatePrevPost },
              },
            },
          ];

          const updateRes = await db_connect
            .collection('post')
            .bulkWrite(updates, { ordered: true, w: 1 });
        } else {
          const updates = [
            {
              insertOne: newPost,
              updateOne: {
                filter: queryNewPost,
                update: { $set: updateNewPost },
              },
              updateOne: {
                filter: queryOriginPost,
                update: { $set: updateOriginPost },
              },
            },
          ];

          const updateRes = await db_connect
            .collection('post')
            .bulkWrite(updates, { ordered: true, w: 1 });
        }
      }

      if (position === 'next') {
        const queryNewPost = { _id: ObjectId(newPostId) };
        const queryOriginPost = { _id: ObjectId(originPost._id) };
        const updateNewPost = {
          next: originPost.next,
          prev: originPost._id,
        };
        const updateOriginPost = {
          next: newPostId,
        };

        if (originPost.next) {
          const queryNextPost = { _id: ObjectId(originPost.next) };
          const updateNextPost = {
            next: newPostId,
          };

          const updates = [
            {
              insertOne: newPost,
              updateOne: {
                filter: queryNewPost,
                update: { $set: updateNewPost },
              },
              updateOne: {
                filter: queryOriginPost,
                update: { $set: updateOriginPost },
              },
              updateOne: {
                filter: queryNextPost,
                update: { $set: updateNextPost },
              },
            },
          ];

          const updateRes = await db_connect
            .collection('post')
            .bulkWrite(updates, { ordered: true, w: 1 });
        }
        const updates = [
          {
            insertOne: newPost,
            updateOne: {
              filter: queryNewPost,
              update: { $set: updateNewPost },
            },
            updateOne: {
              filter: queryOriginPost,
              update: { $set: updateOriginPost },
            },
          },
        ];
        const updateRes = await db_connect
          .collection('post')
          .bulkWrite(updates, { ordered: true, w: 1 });
      }

      return new Promise((resolve, reject) => {
        resolve({ msg: 'Successfully created new post.' });
      });
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject({ msg: 'Error inserting new post.', error });
      });
    }
  }

  static async deletePost(originPost) {
    try {
      let db_connect = dbo.getDb('content');
      const prevPostId = originPost.prev;
      const nextPostId = originPost.next;

      if (prevPostId) {
        const queryPrevPost = { _id: ObjectId(prevPostId) };
        const updatePrevPost = {
          next: nextPostId,
        };
        const updatePrevPostRes = await db_connect
          .collection('post')
          .updateOne(queryPrevPost, { $set: updatePrevPost });
      }

      if (nextPostId) {
        const queryNextPost = { _id: ObjectId(nextPostId) };
        const updateNextPost = {
          prev: prevPostId,
        };
        const updateNextRes = await db_connect
          .collection('post')
          .updateOne(queryNextPost, { $set: updateNextPost });
      }

      const query = {
        _id: ObjectId(originPost._id),
      };

      const deleteRes = await db_connect.collection('post').deleteOne(query);
      resolve(deleteRes);
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject({ msg: 'Error deleting new post.', error });
      });
    }
  }

  static async getPostsInOrder(pageName) {
    try {
      let db_connect = dbo.getDb('content');
      let query = { tabname: pageName };

      const posts = await db_connect.collection('post').find(query).toArray();

      const mapHead = posts.filter((post) => post.prev === null);
      const head = mapHead.length > 0 ? mapHead[0]._id.toString() : null;

      const postMap = new Map();
      for (const post of posts) {
        postMap.set(post._id.toString(), post);
      }
      const postReturnArr = [];
      let currDocId = head;

      while (currDocId) {
        const currDoc = postMap.get(currDocId);
        postReturnArr.push(currDoc);
        currDocId = currDoc.next ? currDoc.next.toString() : null;
      }

      return new Promise((resolve, reject) => {
        resolve(postReturnArr);
      });
    } catch (error) {
      console.log(error);
      return new Promise((resolve, reject) => {
        reject({ msg: 'Error pulling posts.', error });
      });
    }
  }
}

module.exports = postFunctions;
