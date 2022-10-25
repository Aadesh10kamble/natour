const fs = require("node:fs");
const tourModel = require("../../models/tour.js");
const reviewModel = require("../../models/review.js");
const userModel = require("../../models/user.js");
const mongoose = require('mongoose');
const dotenv = require("dotenv");


dotenv.config({
    path: "../../config.env"
});

const simpleTourData = JSON.parse(fs.readFileSync("./tours.json", "utf-8"));
const userData = JSON.parse(fs.readFileSync("./users.json", "utf-8"));
const reviewData = JSON.parse(fs.readFileSync("./reviews.json", "utf-8"));

simpleTourData.forEach(el => delete el.id);
userData.forEach(el => delete el.id);
reviewData.forEach(el => delete el.id);

const models = [
    {
        model: tourModel,
        data: simpleTourData
    },
    {
        model: reviewModel,
        data: reviewData
    },
    {
        model: userModel,
        data: userData
    }
];


const populate = async function () {
    try {
        for (const model of models) {
            await model.model.deleteMany();
            await model.model.create(model.data, { validateBeforeSave: false });
        };

        console.log("DATA SUCCCESSFULLY ADDED");
    } catch (error) {
        console.log(error.message);
    }
};

// const mongodb = process.env.MONGODB.replace("<password>", process.env.DATABASE_PASSWORD);
const mongodb = process.env.MONGODB_LOCAL;
mongoose.connect(mongodb).then(() => {
    console.log("DB Connection Successful");
    populate();
    process.exit(0);
});

console.log(process.argv);

