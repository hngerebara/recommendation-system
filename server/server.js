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

router.route("/slack/command/recommend")
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
        console.log(req.body, "======slackReqObj")


        try {
            const slackReqObj = JSON.parse(req.body.payload);

            let response;
            if (slackReqObj.callback_id === 'recommedations_aud"') {
                response = await generateReport({ slackReqObj });
            }
            return res.json(response);
        } catch (err) {
            log.error(err);
            return res.status(500).send('Something blew up. We\'re looking into it.');
        }
    })

router.route("/recommend")
    .post(async(req,res) => {
        try {
            const db = new Recommendation();
            const slackReqObj = req.body;
                let response = {};

                db.location = slackReqObj.text;

                db.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error adding data"};
                    } else {
                        response = {"error" : false,"message" : "Data added"};
                    }
                    res.json(response);
                });
            //
            // const response = {
            //     response_type: 'in_channel',
            //     channel: slackReqObj.channel_id,
            //     text: `Hello ${slackReqObj.user_name} :slightly_smiling_face: Please give more information`,


                // attachments: [
                //     {
                //         title: "What type of recommendation is this?",
                //         fallback: "You are unable to choose a recommendation type",
                //         callback_id: "recommedation_type",
                //         color: "#3AA3E3",
                //         attachment_type: "default",
                //         actions: [
                //             {
                //                 name: "article",
                //                 text: "Article",
                //                 type: "button",
                //                 value: "article",
                //                 data_source: "testering"
                //             },
                //             {
                //                 name: "book",
                //                 text: "Book",
                //                 type: "button",
                //                 value: "book"
                //             },
                //             {
                //                 name: "video",
                //                 text: "Video",
                //                 type: "button",
                //                 value: "video"
                //             }
                //         ]
                //     },
                    // {
                    //     text: "Please select the best audience",
                    //     fallback: "You are unable to choose an audience",
                    //     callback_id: "recommedations_aud",
                    //     color: "#3AA3E3",
                    //     attachment_type: "default",
                    //     actions: [
                    //         {
                    //             name: "beginner",
                    //             text: "Beginner",
                    //             type: "button",
                    //             value: "beginner"
                    //         },
                    //         {
                    //             name: "intermediate",
                    //             text: "Intermediate",
                    //             type: "button",
                    //             value: "intermediate"
                    //         },
                    //         {
                    //             name: "advanced",
                    //             text: "Advanced",
                    //             type: "button",
                    //             value: "advanced"
                    //         }
                    //     ]
                    // }
                // ]
            // };
            // return res.json(response);
        } catch (err) {
            return res.status(500).send('Something went wrong.');
        }
    });

app.use('/',router);

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
});