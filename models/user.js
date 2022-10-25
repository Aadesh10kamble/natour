const mongoose = require("mongoose");
const validatorModule = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email required"],
        unique: [true, "Email is already taken"],
        lowercase: true,
        validate: [validatorModule.isEmail, "Email not in format"]

    },
    photo: {
        type: String,
        default: "default.jpg"
    },
    active: {
        type: Boolean,
        default: true,
        select: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: [true, "password is required"],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            // Only for save and create method
            validator: function (value) {
                return value === this.password;
            },
            message: "Passwords wont match"
        }
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetTokenTime: {
        type: Date,
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }

    });

userSchema.index({ email: 1 });

// userSchema.virtual("reviews", {
//     ref: "Review",
//     foreignField: "user",
//     localField: "_id"
// });

userSchema.virtual("bookedTours", {
    ref : "Booking",
    foreignField : "user",
    localField : "_id"
})

// Runs after validation and before actually saving the document
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();
    this.passwordChangedAt = new Date();
    this.passwordResetToken = undefined;
    this.passwordResetTokenTime = undefined;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.populate ("bookedTours");
    this.find({ active: true });
    next();
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;