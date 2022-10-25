const reviewModel = require ("../models/review.js");
const tourModel = require ("../models/tour.js");
const Er = require("../errorHandling.js");
const mongoose = require ("mongoose");

const allReview = async function (request,response,next) {
    try {
        let filter = {};
        if (request.params.tourId) filter.tour = request.params.tourId;
        const allReview = await reviewModel.find (filter);
        response.status (200).json ({
            status : "success",
            result : allReview.length,
            data : allReview
        })
    } catch (error) {
        next (error);
    }
};

const postReview = async function (request,response,next) {
    try {
        const reviewData = {...request.body};
        reviewData.user = request.user._id;
        reviewData.tour = request.params.tourId ?? request.body.tour;
        const review = await reviewModel.create (reviewData);
        if (!review) throw new Er.APIError ("ajdasd",404);
        // needs work
        response.status (200).json ({
            success : "Success",
            review : review

        })
    } catch (error) {
        next (error);
    }
};

const deleteReview = async function (request,response) {
    try {
        if (!request.params.tourId) throw new Er.APIError ("Specify the tour");
        await reviewModel.findOneAndDelete ({tour : request.params.tourId});
        response.status (204).json ({
            status : "success",
            data :null
        })
    } catch (error) {
        next (error);
    }
};

exports.myReviews = async (request,response) => {
    console.log (request.user._id);
    const reviews = await reviewModel.find ({user : request.user._id});
}

exports.allReview = allReview;
exports.postReview = postReview;
exports.deleteReview = deleteReview;