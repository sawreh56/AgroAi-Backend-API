import mongoose from "mongoose";

const registrationSchema=new mongoose.Schema({
    name:String,
    number:String,
    email:String,
    expertise:String,
    experiance:String,
    bio:String,
    image:String,
    user_type:String
})

export const expertRegistrationModel=mongoose.model("experts",registrationSchema)