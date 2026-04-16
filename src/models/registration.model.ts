import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
        number: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
        },
        location: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
        crops_type: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true },
        user_type: { type: String, required: true, enum: ["farmer"] },
    },
    {
        timestamps: true,
    }
);

export const registrationModel = mongoose.model("users", registrationSchema);