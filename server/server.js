const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const router = express.Router();

const Recommendation = require('./models/recommend');

const port = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/recommendation', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

router.route("/")
    .get(function(req,res){
        let response = {};
        Recommendation.find({},function(err,data){
            // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    });

router.route("/")
    .post(function(req,res){
        const db = new Recommendation();
        let response = {};

        db.type = req.body.type;
        db.audience =  req.body.audience;
        db.location =  req.body.location;
        db.save(function(err){
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"};
            }
            res.json(response);
        });
    });

app.use('/',router);

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
});