import { Request, Response } from "express";
import { Client } from "@gradio/client";
import fs from "fs";
import path from "path";
import codes from "../utills/status.codes";
import { constMessages } from "../utills/constants";
import { apiErrors } from "../utills/error.handler";

/* =========================
   DISEASE PREDICTION
========================= */
const predictCropDisease = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw apiErrors.badRequest(constMessages.imageRequired);
    }

    const absolutePath = path.resolve(req.file.path);
    const buffer = fs.readFileSync(absolutePath);

    const blob = new Blob([buffer], { type: req.file.mimetype });

    const client = await Client.connect("rsj56/cropdeseasemodel");

    const result = await client.predict("/predict", {
      image: blob,
    });

    return res.status(codes.ok).json({
      status: constMessages.success,
      data: result.data,
    });

  } catch (error: any) {
    const { statusCode, body } = apiErrors.handleApiErrors(error);
    return res.status(statusCode).json(body);
  }
};

/* =========================
   CROP RECOMMENDATION (FIXED)
========================= */
const predictCropRecommendation = async (req: Request, res: Response) => {
  try {
    const {
      nitrogen,
      phosphorus,
      potassium,
      temperature,
      humidity,
      ph,
      rainfall,
    } = req.body;

    const payload = {
      N: Number(nitrogen),
      P: Number(phosphorus),
      K: Number(potassium),
      temperature: Number(temperature),
      humidity: Number(humidity),
      ph: Number(ph),
      rainfall: Number(rainfall),
    };

    if (Object.values(payload).some((v) => Number.isNaN(v))) {
      throw apiErrors.badRequest("All fields must be valid numbers");
    }

    const client = await Client.connect("rsj56/croprecommendations");

    const result = await client.predict("/recommend_crop", payload);

    return res.status(codes.ok).json({
      status: constMessages.success,
      data: result.data,
    });

  } catch (error: unknown) {
    const { statusCode, body } = apiErrors.handleApiErrors(error);
    return res.status(statusCode).json(body);
  }
};

export const homeControllers = {
  predictCropDisease,
  predictCropRecommendation,
};