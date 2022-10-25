const express = require ("express");
const scriptHandler = require ("../Handler/scripeHandler.js");
const authHandler = require ("../Handler/authHandler.js");

const bookingRouter = express.Router ();

bookingRouter.get ("/checkout-session/:tourId",authHandler.protect,scriptHandler.checkOutSession);


module.exports = bookingRouter;