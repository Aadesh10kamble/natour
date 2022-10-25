const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema ({
    review : {
        type : String,
    },
    rating : {
        type : Number,
        max : 5,
        min : 1
    },
    user : {
        type : mongoose.Schema.ObjectId,
        required : [true,"Please Login"],
        ref : "User"
    },
    tour : {
        type : mongoose.Schema.ObjectId,
        required : [true,"Cant find the tour"],
        ref : "Tour"
    }
});


reviewSchema.post ("save",async function (doc,next) {
    const tour = await tourModel.findById (this.tour);
    tour.ratingsQuantity = +1;
    const total = tour.ratingsAverage * (tour.ratingsQuantity-1);
    tour.ratingsAverage =  (total + this.rating)/tour.ratingsQuantity;
    await tour.save ({validateModifiedOnly :true})
    next ();
})

reviewSchema.index ({tour : 1,user : 1},{unique : true});

reviewSchema.pre (/^find/,function (next) {
    this.populate ("user tour");
    next ();
});

const reviewModel = mongoose.model ("Review",reviewSchema);
module.exports = reviewModel;