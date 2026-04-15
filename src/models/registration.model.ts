import mongoose from "mongoose";

const registrationSchema=new mongoose.Schema({
    name:String,
    number:String,
    email:String,
    location:String,
    crops_type:String,
    image:String,
    user_type:String
})

export const registrationModel=mongoose.model("users",registrationSchema)