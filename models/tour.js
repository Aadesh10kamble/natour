const mongoose = require ("mongoose");
const slugify = require("slugify");
const userModel = require("./user.js");
const validatorModule = require("validator");
const bcrypt = require("bcryptjs");

const tourSchema = new mongoose.Schema ({
    name : {
        type : String,
        required : true,
        unique : [true,"ALREADY EXIST"],
        trim : true,
    },
    price : {
        type : Number,
        required : true
    },
    difficulty : {
        type : String,
        default : "easy",
    },
    ratingsAverage : {
        type : Number,
        default : null
    },
    ratingsQuantity : {
        type : Number,
        default : 0
    },
    duration : {
        type : Number,
        require : [true,"Duration of the tour is required"]
    },
    maxGroupSize : {
        type : Number,
        required : [true,""],
    },
    summary : {
        type : String,
        required : [true ,"Summary is required"],
        trim : true
    },
    description : {
        type : String,
        trim : true
    },
    imageCover : {
        type : String,
        required : [true,"ImageCover is required"]
    },
    images : [String],
    startDates : [Date],
    slug : {
        type : String
    },
    secret : {
        type : Boolean,
        default : false
    },
    startLocation : {
        type : {
            type : String,
            default : "Point",
            enum : ["Point"]
        },
        coordinates : [Number],
        address : {
            type : String
        },
        description : {
            type : String
        }
    },
    locations : [{
        type : {
            type : String,
            default : "Point",
            enum : ["Point"]
        },
        coordinates : [Number],
        address : {
            type : String
        },
        description : {
            type : String
        }
    }],
    guides : [{
        type : mongoose.Schema.ObjectId,
        ref : "User"
    }],

},{
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

tourSchema.virtual ("durationInWeek").get (function () {
    return this.duration/7;
});

tourSchema.index ({price : 1 , ratingsAverage : -1});
tourSchema.index ({slug : 1});



// ONLY WORKS FOR .save () AND .create () 
// Between getting the data and saving it.
tourSchema.pre ("save",function (next) {
    this.slug = slugify (this.name,{lower : true});
    next ();
});

// tourSchema.pre ("save",async function (next) {
//     this.users = this.users.map (async id => await userModel.findById(id));
//     this.users = await Promise.all (this.users);
//     next ();
// })
// Pre execution (Before the query is resolved into document).
// tourSchema.pre (/^find/,function (next) {
//     this.find ({secret : false});
//     next ();
// });


// Virtual Populate
tourSchema.virtual ("reviews", {
    ref : "Review",
    foreignField :  "tour",
    localField :  "_id"
});

tourSchema.virtual("bookedTours", {
    ref : "Booking",
    foreignField : "tour",
    localField : "_id"
});

tourSchema.post (/^find/,function (doc,next) {
    next ();
});

const tourModel = mongoose.model ("Tour",tourSchema); 
module.exports = tourModel;