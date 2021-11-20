const express = require('express');
const _ = require('lodash');
const axios = require('axios');
const testData = require('../testdata/testdata').testJSON;

const apiRoutes = express.Router();

apiRoutes.route('/api/:url').get(async (req, res) => {
  const { url } = req.params;
  const decodedURI = decodeURIComponent(url);
  console.log(decodedURI);
  try {
    const response = await axios(url, {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
      credentials: 'same-origin',
    });
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: 'Something went wrong retreiving data.' });
  }
});

module.exports = apiRoutes;
