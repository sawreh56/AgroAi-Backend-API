import { Request,Response, Router } from "express";
import { homeControllers } from "../controllers/home.controllers";
import uploadImage from "../middlewares/uploadImage.middleware";

const homeRouter=Router();

/**
 * @swagger
 * /api/predictions/crop/predict:
 *   post:
 *     tags:
 *       - Predictions
 *     summary: Predict Crop Disease
 *     description: Upload a crop image to detect disease using AI model
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Crop image file
 *     responses:
 *       200:
 *         description: Prediction successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Prediction successful"
 *                 data:
 *                   type: array
 *       400:
 *         description: Image required
 *       500:
 *         description: Prediction failed
 */
homeRouter.post("/crop/predict", uploadImage, homeControllers.predictCropDisease)

/**
 * @swagger
 * /api/predictions/crop/recommendation:
 *   post:
 *     tags:
 *       - Predictions
 *     summary: Get Crop Recommendation
 *     description: Get crop recommendation based on soil and weather parameters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nitrogen
 *               - phosphorus
 *               - potassium
 *               - temperature
 *               - humidity
 *               - ph
 *               - rainfall
 *             properties:
 *               nitrogen:
 *                 type: number
 *                 example: 50
 *               phosphorus:
 *                 type: number
 *                 example: 45
 *               potassium:
 *                 type: number
 *                 example: 40
 *               temperature:
 *                 type: number
 *                 example: 25
 *               humidity:
 *                 type: number
 *                 example: 70
 *               ph:
 *                 type: number
 *                 example: 6.5
 *               rainfall:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Recommendation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Crop recommendation successful"
 *                 data:
 *                   type: array
 *       400:
 *         description: Missing required fields or invalid data
 *       500:
 *         description: Recommendation failed
 */
homeRouter.post("/crop/recommendation", homeControllers.predictCropRecommendation);

export default homeRouter;