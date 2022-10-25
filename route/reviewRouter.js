const express = require("express");
const reviewHandler = require ("../Handler/reviewHandler.js");
const authHandler = require ("../Handler/authHandler.js")

reviewRouter = express.Router ({mergeParams : true});

reviewRouter.route ("").get (reviewHandler.allReview)
                       .post (reviewHandler.postReview)
                       .delete (reviewHandler.deleteReview);

reviewRouter.get ("/my-reviews",authHandler.protect,reviewHandler.myReviews);

module.exports = reviewRouter;