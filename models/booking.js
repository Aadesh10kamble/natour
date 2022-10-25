const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema ({
    tour : {
        type : mongoose.Schema.ObjectId,
        ref : "Tour",
        required : [true]
    },
    user : {
        type :mongoose.Schema.ObjectId,
        ref : "User",
        required : [true]
    },
    price : {
        type : Number,
        required : true
    },
    createdAt : {
        type : Date,
        default : new Date ()
    }
});

bookingSchema.pre (/^find/,function (next) {
    this.populate ("tour");
    next ();
});

const bookingModel = mongoose.model ("Booking",bookingSchema);

module.exports = bookingModel;