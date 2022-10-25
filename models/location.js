const mongoose = require ("mongoose");

const locationSchema = new mongoose.Schema ({
    type : {
        type : String,
        default : "Point",
        enum : ["Point"]
    },
    coordinate : [Number],
    address : {
        type : String
    },
    description : {
        type : String
    }
});

module.exports.locationObject = locationSchema.obj;
