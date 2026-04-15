import mongoose from "mongoose";

const otpSchema=new mongoose.Schema({
    email:String,
    otp:String,
    createdAt:Date
})

export const otpModel=mongoose.model("otps",otpSchema)