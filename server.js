const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
console.log('port', process.env.PORT);
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(require('./routes/record'));

const dbo = require('./db/conn');

app.listen(port, () => {
    // perform database connection when the server starts
    dbo.connectToServer(process.env.DB_NAME || 'leaderboard', (err) => {
        if (err) console.log(err);
    });

    console.log(`Server is running on port: ${port}`);
})