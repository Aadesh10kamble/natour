const userModel = require("../models/user.js")
const factoryHandler = require("./factoryHandler.js");

const getUsers = factoryHandler.findAll(userModel);
const getRequestedUser = factoryHandler.getRequestedDoc(userModel);
const patchUser = factoryHandler.patchDoc(userModel);
const deleteUser = factoryHandler.deleteOne(userModel);

const getMe = async function (request, response, next) {
    try {
        request.params.tourId = request.user.id;
        next();
    } catch (error) {
        next(error);
    }
}

exports.getMe = getMe;
exports.getUsers = getUsers;
exports.getRequestedUser = getRequestedUser;
exports.deleteUser = deleteUser;
exports.patchUser = patchUser;






// const getUsers = async function (request, response) {
//     const allUsers = await userModel.find ({});

//     response.status (200).json ({
//         status: "success",
//         result: allUsers.length,
//         data: allUsers
//     })
// };


// const deleteUser = async function (request, response) {
//     try {
//         await userModel.findByIdAndDelete (request.params.id);
//         response.status(204).json({
//             status: "success",
//             data: null
//         });
//     } catch (error) {
//         next (error);
//     }
// };

// const allUsersId = async function (request,response,next) {
//     const allUsers = await userModel.find ({});
//     request.Ids = allUsers.map (el => String (el._id));
//     next ();
// };