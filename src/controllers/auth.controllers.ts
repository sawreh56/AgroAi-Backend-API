import { Request, Response } from "express"
import { apiErrors } from "../utills/error.handler";
import { constMessages } from "../utills/constants";
import { authServices } from "../services/auth.services";
import codes from "../utills/status.codes";
import { stat } from "node:fs";
import { sendOtpViaEmail } from "../services/mail.services";
import { generateOtp } from "../utills/otp";

const farmerRegisteration=async(req:Request,res:Response)=>{
    try{
        if(!req.body){
            throw apiErrors.badRequest(constMessages.emptyBody)
        }
        if(!req.file){
            throw apiErrors.badRequest(constMessages.imageRequired)
        }
        const {name,number,email,location,crops_type,user_type}=req.body;
        if(!name || !number || !email || !location || !crops_type || !user_type || !req.file){
            throw apiErrors.badRequest(constMessages.EmptyFields)
        }

        const existingUser=await authServices.findUserByEmail(email);
        if(existingUser){
            throw apiErrors.badRequest(constMessages.userAlradyExists)
        }
        const protocol =
        (req.headers["x-forwarded-proto"] as string) || req.protocol;
        const host = (req.headers["x-forwarded-host"] as string) || req.get("host");
        const baseUrl = `${protocol}://${host}`;
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

        const newUser=await authServices.createUser({name,number,email,location,crops_type,user_type,image:imageUrl})
        res.status(codes.created).json({status:constMessages.success,message:constMessages.userRegistered,data:newUser})
    }
    catch(error:unknown){
        const {statusCode,body}=apiErrors.handleApiErrors(error);
        return res.status(statusCode).json(JSON.parse(body))
    }
}


const expertRegisteration=async(req:Request,res:Response)=>{
    try{
        if(!req.body){
            throw apiErrors.badRequest(constMessages.emptyBody)
        }
        if(!req.file){
            throw apiErrors.badRequest(constMessages.imageRequired)
        }
        
        const {name,number,email,expertise,experiance,bio,user_type}=req.body;
        if(!name || !number || !email || !expertise || !experiance || !bio || !user_type || !req.file){
            throw apiErrors.badRequest(constMessages.EmptyFields)
        }

        const protocol =
        (req.headers["x-forwarded-proto"] as string) || req.protocol;
        const host = (req.headers["x-forwarded-host"] as string) || req.get("host");
        const baseUrl = `${protocol}://${host}`;
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

        const existingUser=await authServices.findUserByEmail(email);
        if(existingUser){
            throw apiErrors.badRequest(constMessages.userAlradyExists)
        }

        const newUser=await authServices.createExpertUser({name,number,email,expertise,experiance,bio,image:imageUrl,user_type})
        res.status(codes.created).json({status:constMessages.success,message:constMessages.expertRegistered,data:newUser})
    }
    catch(error:unknown){
        console.error("Expert Registration Error:", error);
        const {statusCode,body}=apiErrors.handleApiErrors(error);
        return res.status(statusCode).json(JSON.parse(body))
    }
}


const userLogin=async(req:Request,res:Response)=>{
    try{
        if(!req.body){
            throw apiErrors.badRequest(constMessages.emptyBody)
        }
        const {email}=req.body;
        if(!email){
            throw apiErrors.badRequest(constMessages.emailRequired)
        }
        
        const existingUser=await authServices.findUserByEmail(email);
        if(!existingUser){
            throw apiErrors.badRequest(constMessages.notFound)
        }
        else{
            const otp=generateOtp();
            await sendOtpViaEmail(email,otp)
            const saveOtp=await authServices.saveUserOtp(email,otp)
            if(!saveOtp){
                throw apiErrors.internalServerError(constMessages.failed)
            }
            res.status(codes.ok).json({status:constMessages.success,message:constMessages.emailSend})
        }
    }
    catch(error:unknown){
        const {statusCode,body}=apiErrors.handleApiErrors(error);
        return res.status(statusCode).json(JSON.parse(body))
    }
}

const verifyOtp=async(req:Request,res:Response)=>{
    try{
        if(!req.body){
            throw apiErrors.badRequest(constMessages.emptyBody)
        }
        const {email,otp}=req.body;
        if(!email || !otp){
            throw apiErrors.badRequest(constMessages.EmptyFields)
        }
        const user=await authServices.findUserByEmail(email);
        if(!user){
            throw apiErrors.badRequest(constMessages.notFound)
        }

        const existingOtp=await authServices.findUserOtpByEmail(email);
        if(!existingOtp){
            throw apiErrors.badRequest(constMessages.otpNotFound)
        }
        if(existingOtp.otp !== otp){
            throw apiErrors.badRequest(constMessages.invalidOtp)
        }
        const createdAt = existingOtp?.createdAt ? new Date(existingOtp.createdAt) : null;

        if (!createdAt || Number.isNaN(createdAt.getTime())) {
            throw apiErrors.badRequest("OTP timestamp missing/invalid");
        }

        const isExpired = Date.now() - createdAt.getTime() > 10 * 60 * 1000;

        if (isExpired) {
            await authServices.deleteUserOtp(email);
            throw apiErrors.badRequest(constMessages.expiredOtp);
        }

        res.status(codes.ok).json({status:constMessages.success,message:constMessages.otpVerified,data:user})
    }
    catch(error:unknown){
        const {statusCode,body}=apiErrors.handleApiErrors(error);
        return res.status(statusCode).json(JSON.parse(body))
    }
}


const deleteAccount=async(req:Request,res:Response)=>{
    try{
            if(!req.body){
                throw apiErrors.badRequest(constMessages.emptyBody)
            }
            const {email}=req.body;
            if(!email){
                throw apiErrors.badRequest(constMessages.emailRequired)
            }
            const deleteUser=await authServices.deleteUserByEmail(email);
            if(!deleteUser){
                throw apiErrors.notFound(constMessages.notFound)
            }
            res.status(codes.ok).json({status:constMessages.success,message:constMessages.accountDeleted})
    }
    catch(error:unknown){
        const {statusCode,body}=apiErrors.handleApiErrors(error);
        return res.status(statusCode).json(JSON.parse(body))
    }
}


const updateFarmer=async(req:Request,res:Response)=>{
    try{
        if(!req.body){
            throw apiErrors.badRequest(constMessages.emptyBody)
        }
        if(!req.file){
            throw apiErrors.badRequest(constMessages.imageRequired)
        }
        
        const {name,number,location,crops_type,email}=req.body;
        if(!name || !number || !email || !location || !crops_type || !req.file){
            throw apiErrors.badRequest(constMessages.EmptyFields)
        }
        
        const protocol =
        (req.headers["x-forwarded-proto"] as string) || req.protocol;
        const host = (req.headers["x-forwarded-host"] as string) || req.get("host");
        const baseUrl = `${protocol}://${host}`;
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

        const existingUser=await authServices.findUserByEmail(email);
        if(!existingUser){
            throw apiErrors.badRequest(constMessages.notFound)
        }
        const updatedUser=await authServices.updateFarmer(email,{name,number,location,crops_type,image:imageUrl})
        console.log(updatedUser)
        res.status(codes.ok).json({status:constMessages.success,message:constMessages.userUpdated})
    }
    catch(error:unknown){
        const {statusCode,body}=apiErrors.handleApiErrors(error);
        return res.status(statusCode).json(JSON.parse(body))
    }
}

const updateExpert=async(req:Request,res:Response)=>{
    try{
        if(!req.body){
            throw apiErrors.badRequest(constMessages.emptyBody)
        }
        if(!req.file){
            throw apiErrors.badRequest(constMessages.imageRequired)
        }
        
        const {name,number,expertise,experiance,bio,email}=req.body;
        if(!name || !number || !email || !expertise || !experiance || !bio || !req.file){
            throw apiErrors.badRequest(constMessages.EmptyFields)
        }
        
        const protocol =
        (req.headers["x-forwarded-proto"] as string) || req.protocol;
        const host = (req.headers["x-forwarded-host"] as string) || req.get("host");
        const baseUrl = `${protocol}://${host}`;
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

        const existingUser=await authServices.findUserByEmail(email);
        if(!existingUser){
            throw apiErrors.badRequest(constMessages.notFound)
        }
        const updatedUser=await authServices.updateExpert(email,{name,number,expertise,experiance,bio,image:imageUrl})
        console.log(updatedUser)
        res.status(codes.ok).json({status:constMessages.success,message:constMessages.userUpdated})
    }
    catch(error:unknown){
        const {statusCode,body}=apiErrors.handleApiErrors(error);
        return res.status(statusCode).json(JSON.parse(body))
    }
}

export const authControllers={
    farmerRegisteration,
    expertRegisteration,
    userLogin,
    verifyOtp,
    deleteAccount,
    updateFarmer,
    updateExpert
}