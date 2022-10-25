const userHandler = require("../Handler/userHandler.js");
const viewsHandler = require("../Handler/viewsHandler.js");
const authHandler = require("../Handler/authHandler.js");
const express = require("express");

const userRouter = express.Router();

userRouter.post("/signup", authHandler.signUp);
userRouter.post("/login", authHandler.login);
userRouter.get("/logout", authHandler.logout);
userRouter.post("/forget-password", authHandler.forgetPassword);
userRouter.get("/change-password/:token", viewsHandler.newPassword);
userRouter.patch("/change-password/:token", authHandler.newPassword);
userRouter.patch("/update-password", authHandler.protect, authHandler.updatePassword);
userRouter.get("/me", authHandler.protect, userHandler.getMe, userHandler.getRequestedUser);
userRouter.delete("/deactivate-profile", authHandler.protect, authHandler.deactivateProfile);

userRouter.route("").get(userHandler.getUsers);

userRouter.route("/:tourId").get(userHandler.getRequestedUser)
    .delete(authHandler.protect, authHandler.restriction, userHandler.deleteUser)
    .patch(authHandler.protect, authHandler.restriction, userHandler.patchUser);

module.exports = userRouter;