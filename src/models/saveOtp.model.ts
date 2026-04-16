import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
        },
        otp: { type: String, required: true, trim: true, minlength: 4, maxlength: 6 },
        createdAt: { type: Date, required: true, default: Date.now },
        expiresAt: { type: Date, required: true, index: { expires: 0 } },
        attempts: { type: Number, required: true, default: 0, min: 0 },
    },
    {
        versionKey: false,
    }
);

export const otpModel = mongoose.model("otps", otpSchema);