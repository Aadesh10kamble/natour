import axios from "axios";
// import Stripe from "stripe";
const stripe = Stripe("pk_test_51LwSAkSFHY5osQasnntyGk54CbAbEokG28fnNWkBUjE998kVq876ODqvUG3mZryDnW4JDvIuT7T5g6Wne1ObyD1k00RHjvlgDr")

const login = async function (data) {
    try {
        const response = await axios({
            method: "POST",
            url: "/api/users/login",
            data: data
        });
        if (response.data.status === "success") {
            // location.assign function will redirect to the given url
            window.location.assign("/overview");
            return ["success", "Successfully logged in"]
        };
        ;
    } catch (error) {
        return ["error", error.response.data.message];
    }
};

const signup = async function (data) {
    try {
        const response = await axios({
            method: "POST",
            url: "/api/users/signup",
            data : data
        });
        if (response.data.status === "success") {
            window.location.assign("/login");
            return ["success", "Account created please login to continue"]
        };
        
    } catch (error) {
        return ["error", error.response.data.message];
    }
}

const logout = async function () {
    try {
        const response = await axios({
            method: "GET",
            url: "/api/users/logout"
        });
        if (response.data.status === "success") {
            if (response.pathname === "/overview") location.reload(true);
            else setTimeout(() => location.assign("/overview"), 2000);
        }
    } catch (error) {
        console.log("error");
    }
}

const profilePasswordChange = async function (type, data) {
    try {
        const endpoint = type === "profile" ? "update-profile" : "update-password";
        const response = await axios({
            method: "PATCH",
            url: `/api/users/${endpoint}`,
            data: data
        });

        if (response.data.status === "success") {
            const msg = (type === "password") ? ", logging you out" : "";
            return ["success", `${endpoint} Has been updated${msg}`];
        }
    } catch (error) {
        return ["error", error.response.data.message];
    }
};
const newPasswordChange = async function (data, token) {
    try {
        const response = await axios({
            method: "patch",
            url: `/api/users/change-password/${token}`,
            data: data
        });
        console.log(response);
        if (response.data.status === "success") {
            console.log("Password Changed");
        }
    } catch (error) {
        console.log(error)
    }
}

const bookTour = async function (tourId) {
    try {
        const url = `/booking/checkout-session/${tourId}`;
        const response = await axios(url);
        await stripe.redirectToCheckout({
            sessionId: response.data.session.id
        })
    } catch (error) {

    }
}
export { login, logout, profilePasswordChange, newPasswordChange, bookTour, signup }