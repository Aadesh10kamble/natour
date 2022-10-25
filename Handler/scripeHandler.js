const dotenv = require ("dotenv");
const tourModel = require("../models/tour");
const bookingModel = require("../models/booking");
dotenv.config({
    path: "./config.env"
});
const stripe = require("stripe")(process.env.STRIPE_KEY);


const checkOutSession = async function (request, response, next) {
    try {
        const tour = await tourModel.findById(request.params.tourId);
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: tour.name,
                            description: tour.summary
                        },
                        unit_amount: tour.price * 100,
                    },
                    quantity: 1,

                }
            ],
            success_url: `${request.protocol}://${request.get("host")}/overview?tour=${tour._id}&user=${request.user._id}&price=${tour.price}`,
            cancel_url: `${request.protocol}://${request.get("host")}/overview`,
            client_reference_id: tour._id,
            customer_email: request.user.email
        });

        response.status(200).json({
            status: "success",
            session
        });
    } catch (error) {
        console.log(error);
    }
}

//Temperary solution
const createBooking = async function (request, response, next) {
    try {
        const { tour, user, price } = request.query;
        if (!tour && !user && !price) return next();
        await bookingModel.create({
            tour: tour,
            user: user,
            price: price
        });
        response.redirect (`${request.protocol}://${request.get("host")}/overview`);
    } catch (error) {
        console.log(error);
    }
}

exports.createBooking = createBooking;
exports.checkOutSession = checkOutSession;