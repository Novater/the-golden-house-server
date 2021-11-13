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
        resolve({ msg: 'Successfully found post.', data: doc });
      });
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject({ msg: 'Error processing.', error });
      });
    }
  }

  static async findPostsByPage(pageName) {
    let db_connect = dbo.getDb('content');
    try {
      const query = {
        tabname: pageName,
      };
      const docs = await db_connect.collection('post').find(query).toArray();

      return new Promise((resolve, reject) => {
        resolve({ msg: 'Successfully retrieved docs', data: docs });
      });
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject({ msg: 'Error retrieving docs', error });
      });
    }
  }

  static async insertManyPosts(posts) {
    try {
      let db_connect = dbo.getDb('content');
      const insertManyRes = await db_connect
        .collection('post')
        .insertMany(posts);
      return new Promise((resolve, reject) => {
        resolve({
          msg: 'Successfully inserted many posts.',
          data: insertManyRes,
        });
      });
    } catch (error) {
      resolve({ msg: 'Error deleting posts.', error });
    }
  }

  static async deletePosts(posts) {
    try {
      const postIds = posts.map((post) => post._id);
      let db_connect = dbo.getDb('content');
      const deleteRes = await db_connect
        .collection('post')
        .deleteMany({ $in: postIds });
      return new Promise((resolve, reject) => {
        resolve({ msg: 'Successfully deleted posts.', data: deleteRes });
      });
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject({ msg: 'Error deleting posts.', error });
      });
    }
  }

  static destructure2DArrayTo1DWithIndexing(inputArr, tab = null) {
    let finalArr = [];

    for (let row = 0; row < inputArr.length; row += 1) {
      for (let col = 0; col < inputArr[row].length; col += 1) {
        const objectId = inputArr[row][col]._id;
        console.log(objectId);
        const flattenedEl = {
          ...inputArr[row][col],
          row,
          col,
          tabname: tab,
          _id: ObjectId(objectId),
        };
        finalArr.push(flattenedEl);
      }
    }

    return finalArr;
  }

  static convert1Dto2DPostArray(inputArr, tab = null) {
    console.log('inputArr', inputArr);
    if (inputArr.length === 0) return [];

    let returnArr = [];

    inputArr.sort((postA, postB) => {
      if (postA.row === postB.row) {
        return postA.col - postB.col;
      }

      return postA.row - postB.row;
    });

    let lastRow = inputArr[inputArr.length - 1].row;

    for (let i = 0; i <= lastRow; i += 1) {
      returnArr.push([]);
    }

    for (const post of inputArr) {
      returnArr[post.row].push(post);
    }
    console.log(returnArr);
    return returnArr;
  }

  static getDeleteManyObj(posts) {
    return posts.map((post) => ObjectId(post._id));
  }

  static rollbackBulkDeleteWrite({ deleteFailed, insertFailed, posts, tab }) {
    console.log('Something went wrong...', deleteFailed, insertFailed);
    //TODO: Implement this function
  }
}

module.exports = postFunctions;
