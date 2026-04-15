import { Request,Response, Router } from "express";
import { homeControllers } from "../controllers/home.controllers";
import uploadImage from "../middlewares/uploadImage.middleware";

const homeRouter=Router();

homeRouter.post("/crop/predict", uploadImage, homeControllers.predictCropDisease)
homeRouter.post("/crop/recommendation", homeControllers.predictCropRecommendation);

export default homeRouter;