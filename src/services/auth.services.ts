import { expertRegistrationModel } from "../models/expertRegistration.model";
import { registrationModel } from "../models/registration.model";
import { otpModel } from "../models/saveOtp.model";

const findUserByEmail = async (email: string) => {
  const user = await registrationModel.findOne({ email: email });
  const expert = await expertRegistrationModel.findOne({ email: email });
  return user || expert;
};

const createUser = async (userData: {
  name: string;
  number: string;
  email: string;
  location: string;
  crops_type: string;
  image: string;
    user_type: string;
}) => {
  const newUser = new registrationModel(userData);
  return await newUser.save();
};

const createExpertUser = async (userData: {
  name: string;
  number: string;
  email: string;
  expertise: string;
  experiance: string;
  bio: string;
  image: string;
  user_type: string;
}) => {
  const expertUser = new expertRegistrationModel(userData);
  return await expertUser.save();
};

const findUserOtpByEmail = async (email: string) => {
    return await otpModel.findOne({email: email})
}

const saveUserOtp = async (email: string, otp: string) => {
    const existingOtp=await findUserOtpByEmail(email);
    if(existingOtp){
        const updatedOtp=await otpModel.findOneAndUpdate({email: email},{otp: otp,createdAt: new Date()})
        return updatedOtp;
    }
    else{
        const newOtp=new otpModel({email,otp,createdAt:new Date()})
        return await newOtp.save();
    }
}

const deleteUserOtp = async (email: string) => {
    await otpModel.deleteOne({email: email})
}

const deleteUserByEmail = async (email: string) => {
    const existingUser=await findUserByEmail(email);
    if(!existingUser){
        return;
    }
    const findUser=await registrationModel.findOne({email: email});
    if(findUser){
        const deletedUser=await registrationModel.deleteOne({email: email})
        return deletedUser;
    }
    else{
        const deletedExpert=await expertRegistrationModel.deleteOne({email: email})
        return deletedExpert;
    }
}


const updateFarmer = async (email: string, updateData: {
    name?: string;
    number?: string;
    location?: string;
    crops_type?: string;
    image?: string;
}) => {
    const updatedUser=await registrationModel.findOneAndUpdate({email: email},updateData)
    return updatedUser;
}

const updateExpert = async (email: string, updateData: {
    name?: string;
    number?: string;
    expertise?: string;
    experiance?: string;
    bio?: string;
    image?: string;
}) => {
    const updatedUser=await expertRegistrationModel.findOneAndUpdate({email: email},updateData)
    return updatedUser;
}

export const authServices = {
  findUserByEmail,
  createUser,
  createExpertUser,
  saveUserOtp,
  findUserOtpByEmail,
  deleteUserOtp,
  deleteUserByEmail,
  updateFarmer,
  updateExpert

};
