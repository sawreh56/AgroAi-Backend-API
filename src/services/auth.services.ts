import { expertRegistrationModel } from "../models/expertRegistration.model";
import { registrationModel } from "../models/registration.model";
import { otpModel } from "../models/saveOtp.model";
import { config } from "../config/envConfig";

const findUserByEmail = async (email: string) => {
    const normalizedEmail = email.toLowerCase();
    const user = await registrationModel.findOne({ email: normalizedEmail });
    const expert = await expertRegistrationModel.findOne({ email: normalizedEmail });
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
    return await otpModel.findOne({ email: email.toLowerCase() });
};

const saveUserOtp = async (email: string, otp: string) => {
    const normalizedEmail = email.toLowerCase();
    const expiryDate = new Date(Date.now() + config.OTP_EXPIRY_MINUTES * 60 * 1000);
    const existingOtp = await findUserOtpByEmail(normalizedEmail);

    if (existingOtp) {
        const updatedOtp = await otpModel.findOneAndUpdate(
            { email: normalizedEmail },
            {
                otp,
                createdAt: new Date(),
                expiresAt: expiryDate,
                attempts: 0,
            },
            { new: true }
        );
        return updatedOtp;
    }

    const newOtp = new otpModel({
        email: normalizedEmail,
        otp,
        createdAt: new Date(),
        expiresAt: expiryDate,
        attempts: 0,
    });
    return await newOtp.save();
};

const incrementOtpAttempt = async (email: string) => {
    return await otpModel.findOneAndUpdate(
        { email: email.toLowerCase() },
        { $inc: { attempts: 1 } },
        { new: true }
    );
};

const deleteUserOtp = async (email: string) => {
    await otpModel.deleteOne({ email: email.toLowerCase() });
};

const deleteUserByEmail = async (email: string) => {
    const normalizedEmail = email.toLowerCase();
    const existingUser=await findUserByEmail(normalizedEmail);
    if(!existingUser){
        return;
    }
    const findUser=await registrationModel.findOne({email: normalizedEmail});
    if(findUser){
        const deletedUser=await registrationModel.deleteOne({email: normalizedEmail})
        return deletedUser;
    }
    else{
        const deletedExpert=await expertRegistrationModel.deleteOne({email: normalizedEmail})
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
    const updatedUser=await registrationModel.findOneAndUpdate({email: email.toLowerCase()},updateData)
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
    const updatedUser=await expertRegistrationModel.findOneAndUpdate({email: email.toLowerCase()},updateData)
    return updatedUser;
}

export const authServices = {
  findUserByEmail,
  createUser,
  createExpertUser,
  saveUserOtp,
    incrementOtpAttempt,
  findUserOtpByEmail,
  deleteUserOtp,
  deleteUserByEmail,
  updateFarmer,
    updateExpert,
};
