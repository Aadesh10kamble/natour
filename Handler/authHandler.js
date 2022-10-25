// SIGNUP,LOGIN,newPASSWORD
const crypto = require("node:crypto");
const userModel = require("../models/user.js");
const jwtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Er = require("../errorHandling.js");
const Mail = require("../emailSender.js");

//SIGNUP 

const signUp = async function (request, response, next) {
    try {
        const signCred = { ...request.body };
        // if (signCred.role) delete signCred.role;
        const newUser = await userModel.create(signCred);
        newUser.password = undefined;
        await new Mail(newUser, "").sendWelcome();
        response.status(201).json({
            success: "success",
            data: {
                newUser
            }
        })
    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
};

const login = async function (request, response, next) {

    try {
        const { email, password } = request.body;
        if (!email && !password) throw new Er.APIError("Either password OR email not provided", 400);

        const user = await (userModel.findOne({ email: email }).select("+password"));
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Er.APIError("Incorrect Password OR email", 400);
        };

        if (!user.active) throw new Er.APIError("Account is deactivated");

        const token = jwtoken.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

        response.cookie("jwt", token, {
            secure: true,
            httpOnly: true
        })

        response.status(200).json({
            status: "success",
            token: token
        })

    } catch (error) {
        next(error);
    }
};

const logout = async function (request, response, next) {
    try {
        response.cookie("jwt", "abcd", {
            httpOnly: true
        });
        response.status(200).json({ status: "success" });
    } catch (error) {
        next(error);
    }
};

const protect = async function (request, response, next) {
    try {
        let token;
        const { authorization } = request.headers;
        if (authorization && authorization.startsWith("Bearer")) {
            token = authorization.split(" ").at(1);
        } else if (request.cookies.jwt) token = request.cookies.jwt;

        if (!token) throw new Er.APIError("ACCESS DENIED please login", 404);
        const decoded = jwtoken.verify(token, process.env.JWT_SECRET_KEY);

        // to check if the users is not deleted after issuing the token.
        const user = await userModel.findById(decoded.id).select("+password");
        if (!user) throw new Er.APIError("User doesnt exist", 404);

        // to check if the user password was changed after issuing the token.
        if (user.passwordChangedAt) {
            const changedTimeStamp = user.passwordChangedAt.getTime() / 1000;
            if (changedTimeStamp > decoded.iat) throw new Er.APIError("Password changed please login again", 400);
        };
        response.locals = request.user = user;
        console.log("PROTECT");
        next();
    } catch (error) {
        next(error);
    }

};

const isLoggedIn = async function (request, response, next) {
    if (request.cookies.jwt) {
        let decoded;
        try {
            decoded = jwtoken.verify(request.cookies.jwt, process.env.JWT_SECRET_KEY);
        } catch (error) {
            return next();
        }
        const user = await userModel.findById(decoded.id).select("+password");
        if (!user) return next();
        if (user.passwordChangedAt) {
            const changedTimeStamp = user.passwordChangedAt.getTime() / 1000;
            if (changedTimeStamp > decoded.iat) return next();
        };
        response.locals.user = user;
        return next();
    };
    next();

};
const restriction = async function (request, response, next) {
    try {
        const { role } = request.user;
        if (!["admin"].includes(role)) throw new Er.APIError("NO Permission", 403);
        next();
    } catch (error) {
        next(error);
    }
};


const forgetPassword = async function (request, response, next) {
    try {
        const { email } = request.body;
        const user = await userModel.findOne({ email: email });
        if (!user) throw new Er.APIError(`No Account using ${email} registered`, 404);

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.passwordResetTokenTime = new Date();
        await user.save({ validateModifiedOnly: true });
        // const updateData = {
        //     passwordResetToken : crypto.createHash("sha256").update(resetToken).digest("hex"),
        //     passwordResetTokenTime : new Date ()
        // }
        // const newuser = await userModel.findByIdAndUpdate (user._id,updateData,{
        //     new : true,
        //     runValidators : true
        // });
        const url = `${request.protocol}//:${request.get("host")}/api/users/change-password/${resetToken}`;
        await new Mail(user, url).sendResetEmail();
        // await mailSender.sendMail({ email: email, resettoken: resetToken });
        response.status(200).json({
            status: "success",
            message: "Email has been send",
        })
    } catch (error) {
        next(error);
    }
};

const newPassword = async function (request, response, next) {
    try {
        let { token } = request.params;
        token = crypto.createHash("sha256").update(token).digest("hex");
        console.log(token);
        const user = await userModel.findOne({ passwordResetToken: token });
        if (!user) throw new Er.APIError("Wrong ResetToken", 400);

        if (new Date().getTime() - user.passwordResetTokenTime.getTime() > 300000) {
            user.passwordResetToken = user.passwordResetTokenTime = undefined;
            await user.save({ validateModifiedOnly: true });
            throw new Er.APIError("Token has expired", 400);
        };

        const { newPassword, newPasswordConfirm } = request.body;
        user.password = newPassword;
        user.passwordConfirm = newPasswordConfirm;
        await user.save();

        response.status(201).json({
            status: "success",
            message: "Password changed successfully"
        });

    } catch (error) {
        next(error);
    }
};

const updatePassword = async function (request, response, next) {
    try {
        const { currentPassword, newPassword, newPasswordConfirm } = request.body;
        if (!currentPassword) throw new Er.APIError("Please provide current password");
        if (!await bcrypt.compare(currentPassword, request.user.password)) throw new Er.APIError("Wrong current password", 400);

        request.user.password = newPassword;
        request.user.passwordConfirm = newPasswordConfirm;
        await request.user.save();

        response.status(201).json({
            status: "success",
            message: "Msg change successfully"
        })
    } catch (error) {
        next(error);
    }
};

const updateProfile = async function (request, response, next) {
    const dataAllowedUpdate = ["email", "name", "photo"];
    try {
        console.log("UPDATE PROFILE");
        console.log(request.body);
        if (request.body.password || request.body.passwordConfirm) throw new Er.APIError("Password not updated here", 400);
        const updateData = { ...request.body };
        updateData.photo = request.file.filename;
        Object.keys(updateData).forEach(el => {
            if (!dataAllowedUpdate.includes(el)) delete updateData[el];
        });

        const updateUser = await userModel.findByIdAndUpdate(request.user._id, updateData, {
            new: true,
            runValidators: true
        });
        // If All the fields are NOT mandatory USE findIdAndUpdate method

        // request.user.email = updateData.email;
        // request.user.name = updateData.name;
        // await request.user.save ({validateModifiedOnly : true});

        response.status(200).json({
            status: "success",
            newData: {
                updateUser
            }
        });

    } catch (error) {
        next(error);
    }
};

const deactivateProfile = async function (request, response, next) {
    try {
        const { password } = request.body;
        if (!password) throw new Er.APIError("Password needed to delete the profile");
        if (!await bcrypt.compare(password, request.user.password)) throw new Er.APIError("Wrong password");

        request.user.active = false;
        await request.user.save({ validateModifiedOnly: true });

        response.status(204).json({
            status: "Success"
        })
    } catch (error) {
        next(error);
    }
};

exports.logout = logout;
exports.isLoggedIn = isLoggedIn;
exports.deactivateProfile = deactivateProfile;
exports.updateProfile = updateProfile;
exports.updatePassword = updatePassword;
exports.newPassword = newPassword;
exports.forgetPassword = forgetPassword;
exports.restriction = restriction;
exports.protect = protect;
exports.signUp = signUp;
exports.login = login;