const tourModel = require("../models/tour.js");
const bookModel = require ("../models/booking.js");
const Er = require("../errorHandling.js");
const userModel = require("../models/user.js");
const multer = require("multer");
const sharp = require("sharp");

const tourOverview = async function (request, response, next) {
    try {
        const tours = await tourModel.find({});
        response.status(200).render("overview", {
            tours: tours,
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};

const tourDetail = async function (request, response, next) {
    try {
        const { slug } = request.params;
        console.log (slug);
        const tour = await tourModel.findOne({ slug: slug }).populate ("guides reviews");
        if (!tour) throw new Er.APIError(`Not Tour ${slug} Found`);
        console.log ("tourDetails");
        
        response.status(200).render("tour", {
            tour: tour,
            title: tour.name
        });

    } catch (error) {
        next(error);
    }
};

const login = async function (request, response, next) {
    try {
        response.status(200).render("login")
    } catch (error) {
        next(error);
    }
};

const signup = async (request,response,next) => {
    try {
        response.status (200).render ("signup");
    } catch (error) {
        next(error);
    }   
}

const userProfile = async function (request, response, next) {
    try {
        response.status(200).render("profile");
    } catch (error) {
        next(error);
    }
};

const urlNotFound = async function (request, response, next) {
    next(new Er.APIError("404 PAGE NOT FOUND", 404));
}

const updateProfile = async function (request, response, next) {
    try {
        const updateData = {
            name: request.body.name,
            email: request.body.email
        };
        if (request.file) updateData.photo = request.file.filename;
        const UpdateUser = await userModel.findByIdAndUpdate(request.user._id, updateData, {
            new: true,
            runValidators: true
        });
        response.status(200).render("profile", {
            user: UpdateUser
        });
    } catch (error) {
        next(error);
    }
};

const newPassword = async function (request, response, next) {
    response.status(200).render("changepassword");
}

const bookedTours = async function (request,response,next) {
    try {
        const bookedTour = request.user.bookedTours.map ((el) => el.tour);
        response.status (200).render ("overview",{
            tours : bookedTour
        });
    } catch (error) {
        console.log (error);
    }
} 
// const storage = multer.diskStorage ({
//     destination : function (request,file,cb) {
//         cb (null,`public/img/users`);
//     },
//     filename : function (request,file,cb) {
//         const extension = file.mimetype.split ("/")[1];
//         const filename = `${request.user._id}.${extension}`;
//         cb (null,filename);
//     }
// });

const storage = multer.memoryStorage();

const filter = function (request, file, cb) {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else cb(new Er.APIError("Not a image", 400), false);
};

const photo = multer({
    storage: storage,
    fileFilter: filter
});

const resizePhoto = function (request, response, next) {
    if (!request.file) next();
    request.file.filename = `${request.user._id}.jpeg`;
    sharp(request.file.buffer).resize(500, 500)
        .toFormat("jpeg")
        .toFile(`public/img/users/${request.file.filename}`);
    next();
};

exports.signup = signup;
exports.bookedTours = bookedTours;
exports.newPassword = newPassword;
exports.resizePhoto = resizePhoto;
exports.uploadPhoto = photo.single("photo");
exports.updateProfile = updateProfile;
exports.urlNotFound = urlNotFound;
exports.userProfile = userProfile;
exports.login = login;
exports.tourDetail = tourDetail;
exports.tourOverview = tourOverview;