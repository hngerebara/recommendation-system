const bodyParser = require('body-parser');
const express = require('express');

const api = require('./api');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', async (req, res) => {
    console.log(req.body);

    res.status(200).send('Thanks.')
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
});