
const mongoose = require("mongoose");
const mongoSchema =   mongoose.Schema;

// create schema
const recommendationSchema  = {
    "type": String,
    "location": String,
    "audience": String,
    "dateAdded": Date
};

// create model if not exists.
module.exports = mongoose.model('recommendation',recommendationSchema);