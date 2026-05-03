import { Request, Response } from "express";
import { apiErrors } from "../utills/error.handler";
import { constMessages } from "../utills/constants";
import { authServices } from "../services/auth.services";
import codes from "../utills/status.codes";
import { sendOtpViaEmail } from "../services/mail.services";
import { generateOtp } from "../utills/otp";
import { config } from "../config/envConfig";
import { generateAccessToken } from "../utills/token";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s()]{10,20}$/;

const isValidEmail = (value: string): boolean => emailRegex.test(value.trim());
const isValidPhone = (value: string): boolean => phoneRegex.test(value.trim());

/* =========================
   FARMER REGISTER
========================= */
const farmerRegisteration = async (req: Request, res: Response) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw apiErrors.badRequest(constMessages.emptyBody);
        }

        const { name, number, email, location, crops_type, user_type } = req.body;

        // Only name, number, email, and user_type are required during registration
        if (!name || !number || !email || !user_type) {
            throw apiErrors.badRequest(constMessages.EmptyFields);
        }

        if (!isValidEmail(String(email))) {
            throw apiErrors.badRequest("Please provide a valid email address");
        }

        if (!isValidPhone(String(number))) {
            throw apiErrors.badRequest("Please provide a valid phone number");
        }

        if (String(user_type).toLowerCase() !== "farmer") {
            throw apiErrors.badRequest("user_type must be farmer for this endpoint");
        }

        const normalizedUserType = String(user_type).toLowerCase();

        const normalizedEmail = String(email).toLowerCase();
        const existingUser = await authServices.findUserByEmail(normalizedEmail);
        if (existingUser) {
            throw apiErrors.badRequest(constMessages.userAlradyExists);
        }

        const protocol =
            (req.headers["x-forwarded-proto"] as string) || req.protocol;
        const host =
            (req.headers["x-forwarded-host"] as string) || req.get("host");

        const baseUrl = `${protocol}://${host}`;
        const imageUrl = req.file ? `${baseUrl}/uploads/${req.file.filename}` : undefined;

        const newUser = await authServices.createUser({
            name,
            number,
            email: normalizedEmail,
            location: location || undefined,
            crops_type: crops_type || undefined,
            user_type: normalizedUserType,
            image: imageUrl || undefined,
        });

        return res.status(codes.created).json({
            status: constMessages.success,
            message: constMessages.userRegistered,
            data: newUser,
        });
    } catch (error: unknown) {
        const { statusCode, body } = apiErrors.handleApiErrors(error);
        return res.status(statusCode).json(body);
    }
};

/* =========================
   EXPERT REGISTER
========================= */
const expertRegisteration = async (req: Request, res: Response) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw apiErrors.badRequest(constMessages.emptyBody);
        }

        const { name, number, email, expertise, experiance, bio, user_type } =
            req.body;

        // Only name, number, email, and user_type are required during registration
        if (!name || !number || !email || !user_type) {
            throw apiErrors.badRequest(constMessages.EmptyFields);
        }

        if (!isValidEmail(String(email))) {
            throw apiErrors.badRequest("Please provide a valid email address");
        }

        if (!isValidPhone(String(number))) {
            throw apiErrors.badRequest("Please provide a valid phone number");
        }

        if (String(user_type).toLowerCase() !== "expert") {
            throw apiErrors.badRequest("user_type must be expert for this endpoint");
        }

        if (bio && String(bio).trim().length < 10) {
            throw apiErrors.badRequest("bio must be at least 10 characters long");
        }

        const normalizedUserType = String(user_type).toLowerCase();

        const normalizedEmail = String(email).toLowerCase();
        const existingUser = await authServices.findUserByEmail(normalizedEmail);
        if (existingUser) {
            throw apiErrors.badRequest(constMessages.userAlradyExists);
        }

        const protocol =
            (req.headers["x-forwarded-proto"] as string) || req.protocol;
        const host =
            (req.headers["x-forwarded-host"] as string) || req.get("host");

        const baseUrl = `${protocol}://${host}`;
        const imageUrl = req.file ? `${baseUrl}/uploads/${req.file.filename}` : undefined;

        const newUser = await authServices.createExpertUser({
            name,
            number,
            email: normalizedEmail,
            expertise: expertise || undefined,
            experiance: experiance || undefined,
            bio: bio || undefined,
            image: imageUrl || undefined,
            user_type: normalizedUserType,
        });

        return res.status(codes.created).json({
            status: constMessages.success,
            message: constMessages.expertRegistered,
            data: newUser,
        });
    } catch (error: unknown) {
        const { statusCode, body } = apiErrors.handleApiErrors(error);
        return res.status(statusCode).json(body);
    }
};

/* =========================
   UPDATE FARMER
========================= */
const updateFarmer = async (req: Request, res: Response) => {
    try {
        const { name, number, location, crops_type, email } = req.body;

        if (!name || !number || !location || !crops_type || !email) {
            throw apiErrors.badRequest(constMessages.EmptyFields);
        }

        if (!isValidEmail(String(email))) {
            throw apiErrors.badRequest("Please provide a valid email address");
        }

        if (!isValidPhone(String(number))) {
            throw apiErrors.badRequest("Please provide a valid phone number");
        }

        const normalizedEmail = String(email).toLowerCase();
        const authenticatedEmail = (req as Request & { authUser?: { email: string } }).authUser?.email;
        if (!authenticatedEmail || authenticatedEmail !== normalizedEmail) {
            throw apiErrors.forbidden("You can only update your own account");
        }

        const existingUser = await authServices.findUserByEmail(normalizedEmail);
        if (!existingUser) {
            throw apiErrors.notFound(constMessages.notFound);
        }

        const imageUrl = req.file
            ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
            : undefined;

        await authServices.updateFarmer(normalizedEmail, {
            name,
            number,
            location,
            crops_type,
            image: imageUrl,
        });

        return res.status(codes.ok).json({
            status: constMessages.success,
            message: constMessages.userUpdated,
        });
    } catch (error: unknown) {
        const { statusCode, body } = apiErrors.handleApiErrors(error);
        return res.status(statusCode).json(body);
    }
};

/* =========================
   UPDATE EXPERT
========================= */
const updateExpert = async (req: Request, res: Response) => {
    try {
        const { name, number, expertise, experiance, bio, email } = req.body;

        if (!name || !number || !expertise || !experiance || !bio || !email) {
            throw apiErrors.badRequest(constMessages.EmptyFields);
        }

        if (!isValidEmail(String(email))) {
            throw apiErrors.badRequest("Please provide a valid email address");
        }

        if (!isValidPhone(String(number))) {
            throw apiErrors.badRequest("Please provide a valid phone number");
        }

        const normalizedEmail = String(email).toLowerCase();
        const authenticatedEmail = (req as Request & { authUser?: { email: string } }).authUser?.email;
        if (!authenticatedEmail || authenticatedEmail !== normalizedEmail) {
            throw apiErrors.forbidden("You can only update your own account");
        }

        const existingUser = await authServices.findUserByEmail(normalizedEmail);
        if (!existingUser) {
            throw apiErrors.notFound(constMessages.notFound);
        }

        const imageUrl = req.file
            ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
            : undefined;

        await authServices.updateExpert(normalizedEmail, {
            name,
            number,
            expertise,
            experiance,
            bio,
            image: imageUrl,
        });

        return res.status(codes.ok).json({
            status: constMessages.success,
            message: constMessages.userUpdated,
        });
    } catch (error: unknown) {
        const { statusCode, body } = apiErrors.handleApiErrors(error);
        return res.status(statusCode).json(body);
    }
};

/* =========================
   LOGIN
========================= */
const userLogin = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw apiErrors.badRequest(constMessages.emailRequired);
        }

        if (!isValidEmail(String(email))) {
            throw apiErrors.badRequest("Please provide a valid email address");
        }

        const normalizedEmail = String(email).toLowerCase();

        const existingUser = await authServices.findUserByEmail(normalizedEmail);
        if (!existingUser) {
            throw apiErrors.badRequest(constMessages.notFound);
        }

        const otp = generateOtp();
        await sendOtpViaEmail(normalizedEmail, otp);

        const saveOtp = await authServices.saveUserOtp(normalizedEmail, otp);

        if (!saveOtp) {
            throw apiErrors.internalServerError(constMessages.failed);
        }

        return res.status(codes.ok).json({
            status: constMessages.success,
            message: constMessages.emailSend,
        });
    } catch (error: unknown) {
        const { statusCode, body } = apiErrors.handleApiErrors(error);
        return res.status(statusCode).json(body);
    }
};

/* =========================
   VERIFY OTP
========================= */
const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            throw apiErrors.badRequest(constMessages.EmptyFields);
        }

        if (!isValidEmail(String(email))) {
            throw apiErrors.badRequest("Please provide a valid email address");
        }

        if (!/^\d{4,6}$/.test(String(otp))) {
            throw apiErrors.badRequest("OTP format is invalid");
        }

        const normalizedEmail = String(email).toLowerCase();

        const user = await authServices.findUserByEmail(normalizedEmail);
        if (!user) {
            throw apiErrors.badRequest(constMessages.notFound);
        }

        const existingOtp = await authServices.findUserOtpByEmail(normalizedEmail);
        if (!existingOtp) {
            throw apiErrors.badRequest(constMessages.otpNotFound);
        }

        if (existingOtp.expiresAt && Date.now() > new Date(existingOtp.expiresAt as unknown as string).getTime()) {
            await authServices.deleteUserOtp(normalizedEmail);
            throw apiErrors.badRequest(constMessages.expiredOtp);
        }

        if (existingOtp.otp !== String(otp)) {
            const otpAfterAttempt = await authServices.incrementOtpAttempt(normalizedEmail);
            if (otpAfterAttempt && otpAfterAttempt.attempts >= config.OTP_MAX_ATTEMPTS) {
                await authServices.deleteUserOtp(normalizedEmail);
                throw apiErrors.tooManyRequests("Maximum OTP attempts exceeded. Please login again.");
            }
            throw apiErrors.badRequest(constMessages.invalidOtp);
        }

        await authServices.deleteUserOtp(normalizedEmail);
        const token = generateAccessToken({ email: normalizedEmail });

        return res.status(codes.ok).json({
            status: constMessages.success,
            message: constMessages.otpVerified,
            data: user,
            token,
        });
    } catch (error: unknown) {
        const { statusCode, body } = apiErrors.handleApiErrors(error);
        return res.status(statusCode).json(body);
    }
};

/* =========================
   DELETE ACCOUNT
========================= */
const deleteAccount = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw apiErrors.badRequest(constMessages.emailRequired);
        }

        if (!isValidEmail(String(email))) {
            throw apiErrors.badRequest("Please provide a valid email address");
        }

        const normalizedEmail = String(email).toLowerCase();
        const authenticatedEmail = (req as Request & { authUser?: { email: string } }).authUser?.email;
        if (!authenticatedEmail || authenticatedEmail !== normalizedEmail) {
            throw apiErrors.forbidden("You can only delete your own account");
        }

        const deleted = await authServices.deleteUserByEmail(normalizedEmail);

        if (!deleted) {
            throw apiErrors.notFound(constMessages.notFound);
        }

        return res.status(codes.ok).json({
            status: constMessages.success,
            message: constMessages.accountDeleted,
        });
    } catch (error: unknown) {
        const { statusCode, body } = apiErrors.handleApiErrors(error);
        return res.status(statusCode).json(body);
    }
};

export const authControllers = {
    farmerRegisteration,
    expertRegisteration,
    updateFarmer,
    updateExpert,
    userLogin,
    verifyOtp,
    deleteAccount,
};