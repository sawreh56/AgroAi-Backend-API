import { Request,Response, Router } from "express";
import { authControllers } from "../controllers/auth.controllers";
import uploadImage from "../middlewares/uploadImage.middleware";

const router=Router();

/**
 * @swagger
 * /api/auth/register_farmer:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register as a Farmer
 *     description: Create a new farmer account with profile image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - number
 *               - location
 *               - crops_type
 *               - user_type
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "farmer@agroai.com"
 *               number:
 *                 type: string
 *                 example: "03001234567"
 *               location:
 *                 type: string
 *                 example: "Karachi"
 *               crops_type:
 *                 type: string
 *                 example: "wheat,rice"
 *               user_type:
 *                 type: string
 *                 example: "farmer"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Farmer registered successfully
 *       400:
 *         description: Bad request - missing fields or email exists
 */
router.post("/register_farmer",uploadImage,authControllers.farmerRegisteration)

/**
 * @swagger
 * /api/auth/register_expert:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register as an Expert
 *     description: Create a new expert account with profile image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - number
 *               - expertise
 *               - experiance
 *               - bio
 *               - user_type
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dr. Ahmed Khan"
 *               email:
 *                 type: string
 *                 example: "expert@agroai.com"
 *               number:
 *                 type: string
 *                 example: "03009876543"
 *               expertise:
 *                 type: string
 *                 example: "Crop Disease Management"
 *               experiance:
 *                 type: string
 *                 example: "15 years"
 *               bio:
 *                 type: string
 *                 example: "Expert in crop diseases"
 *               user_type:
 *                 type: string
 *                 example: "expert"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Expert registered successfully
 *       400:
 *         description: Bad request - missing fields or email exists
 */
router.post("/register_expert",uploadImage,authControllers.expertRegisteration)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Send OTP to Email
 *     description: Request OTP for login using email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "farmer@agroai.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request or user not found
 */
router.post("/login",authControllers.userLogin)

/**
 * @swagger
 * /api/auth/verify_otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify OTP
 *     description: Verify OTP sent to email and complete login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: "farmer@agroai.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verify_otp",authControllers.verifyOtp)

/**
 * @swagger
 * /api/auth/delete_account:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Delete Account
 *     description: Delete user account permanently
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "farmer@agroai.com"
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: User not found
 */
router.post("/delete_account",authControllers.deleteAccount)

/**
 * @swagger
 * /api/auth/update_farmer:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Update Farmer Profile
 *     description: Update farmer profile information and image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - number
 *               - location
 *               - crops_type
 *               - image
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               number:
 *                 type: string
 *               location:
 *                 type: string
 *               crops_type:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Farmer profile updated successfully
 *       400:
 *         description: Bad request or user not found
 */
router.put("/update_farmer",uploadImage,authControllers.updateFarmer)

/**
 * @swagger
 * /api/auth/update_expert:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Update Expert Profile
 *     description: Update expert profile information and image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - number
 *               - expertise
 *               - experiance
 *               - bio
 *               - image
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               number:
 *                 type: string
 *               expertise:
 *                 type: string
 *               experiance:
 *                 type: string
 *               bio:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Expert profile updated successfully
 *       400:
 *         description: Bad request or user not found
 */
router.put("/update_expert",uploadImage,authControllers.updateExpert)

export default router;