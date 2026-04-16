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
        expertise: { type: String, required: true, trim: true, maxlength: 160 },
        experiance: { type: String, required: true, trim: true, maxlength: 100 },
        bio: { type: String, required: true, trim: true, minlength: 10, maxlength: 1200 },
        image: { type: String, required: true, trim: true },
        user_type: { type: String, required: true, enum: ["expert"] },
    },
    {
        timestamps: true,
    }
);

export const expertRegistrationModel = mongoose.model("experts", registrationSchema);