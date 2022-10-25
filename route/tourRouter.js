const tourHandler = require("../Handler/tourHandler.js");
const authHandler = require("../Handler/authHandler.js");
const reviewRouter = require("./reviewRouter");
const express = require("express");
const tourRouter = express.Router();

tourRouter.use("/:tourId/review", reviewRouter);

tourRouter.route("/get-stats").get(tourHandler.getTourStats);
tourRouter.route("/top-5-cheap").get(tourHandler.topCheap,
    tourHandler.getAllTours);

tourRouter.route("").get(tourHandler.getAllTours)
    .post(authHandler.protect,
        authHandler.restriction,
        tourHandler.postTour);

tourRouter.route("/:tourId").get(tourHandler.getRequestedTour)
    .patch(authHandler.protect,
        authHandler.restriction,
        tourHandler.collectPhoto,
        tourHandler.uploadPhoto,
        tourHandler.patchTour)
    .delete(tourHandler.deleteTour);

module.exports = tourRouter;