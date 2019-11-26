const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const router = express.Router();

const Recommendation = require('./models/recommend');

const port = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client/build")));

mongoose.connect('mongodb://127.0.0.1:27017/recommendation', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

router.route("/recommend")
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

router.route("/actions")
    .post(async(req, res) => {

        const db = new Recommendation();

        try {
            const slackReqObj = JSON.parse(req.body.payload);

            db.audience = slackReqObj.actions[0].name;

            db.location = slackReqObj.original_message.text;

            db.save(function(err){
                if(err) {
                    response = {"error" : true,"message" : "Error adding data"};
                } else {
                    response = `Thank you :books: :nerd_face: ${slackReqObj.user.name} for your recommendation :tada:`;
                }
                res.json(response);
            });

            return res.json(response);
        } catch (err) {
            return res.status(500).send('Something went wrong.');
        }
    });

router.route("/recommend")
    .post(async(req,res) => {
        try {
            const slackReqObj = req.body;
            if(slackReqObj.text){
                const response = {
                    response_type: 'in_channel',
                    channel: slackReqObj.channel_id,
                    text: `You are recommending: ${slackReqObj.text}`,
                    attachments: [
                        {
                            text: "Please select the best audience",
                            fallback: "You are unable to choose an audience",
                            callback_id: "recommendation_audience",
                            color: "#3AA3E3",
                            attachment_type: "default",
                            actions: [
                                {
                                    name: "beginner",
                                    text: "Beginner",
                                    type: "button",
                                    value: "beginner"
                                },
                                {
                                    name: "intermediate",
                                    text: "Intermediate",
                                    type: "button",
                                    value: "intermediate"
                                },
                                {
                                    name: "advanced",
                                    text: "Advanced",
                                    type: "button",
                                    value: "advanced"
                                }
                            ]
                        }
                    ]
                };
                return res.status(200).json(response);
            } else {
                return res.send("No recommendations included. Please type /recommend <recommendation>");
            }

        } catch (err) {
            return res.status(500).send('Something went wrong.');
        }
    });

app.use('/',router);

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
});