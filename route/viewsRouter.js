const express = require("express");
const viewsHandler = require ("../Handler/viewsHandler.js")
const authHandler = require ("../Handler/authHandler.js");
const bookingHandler = require("../Handler/scripeHandler.js");
const viewRouter = express.Router ();

viewRouter.use (authHandler.isLoggedIn);
viewRouter.route ("/overview").get (bookingHandler.createBooking,viewsHandler.tourOverview);
viewRouter.route ("/tour/:slug").get (viewsHandler.tourDetail);
viewRouter.route ("/login").get (viewsHandler.login);
viewRouter.route ("/signup").get (viewsHandler.signup);
viewRouter.route ("/my-profile").get (viewsHandler.userProfile);
viewRouter.post ("/update-profile",authHandler.protect,viewsHandler.uploadPhoto,viewsHandler.resizePhoto,viewsHandler.updateProfile);
viewRouter.get ("/booked-tours",authHandler.protect,viewsHandler.bookedTours);
// viewRouter.route ("/my-profile").post (authHandler.protect,viewsHandler.updateProfile);

// viewRouter.use (viewsHandler.urlNotFound);

// viewRouter.use ((error,request,response,next) => {
//     const statusCode = error.statusCode ?? 400;
//     response.status (statusCode).render ("error",{
//         message : error.message
//     });
// });

module.exports = viewRouter;