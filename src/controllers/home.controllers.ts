import { Request, Response } from "express";
import { Client } from "@gradio/client";
import fs from "fs";
import path from "path";
import codes from "../utills/status.codes";
import { constMessages } from "../utills/constants";
import { apiErrors } from "../utills/error.handler";

// diskStorage: read file from path -> Blob
const filePathToBlob = (filePath: string, mimetype?: string) => {
  const buffer = fs.readFileSync(filePath); // real bytes
  const uint8 = new Uint8Array(buffer);
  return new Blob([uint8], { type: mimetype || "image/png" });
};

const predictCropDisease = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw apiErrors.badRequest(constMessages.imageRequired);
    }

    // ✅ IMPORTANT: req.file.path is relative (uploads/..)
    const absolutePath = path.resolve(req.file.path);

    const imageBlob = filePathToBlob(absolutePath, req.file.mimetype);

    console.log("file size:", req.file.size);
    console.log("blob size:", imageBlob.size); // should be same-ish and > 0

    const client = await Client.connect("rsj56/cropdeseasemodel");

    const result = await client.predict("/predict", {
      image: imageBlob,
    });

    return res.status(codes.ok).json({
      status: constMessages.success,
      message: "Prediction successful",
      data: result.data,
    });
  } catch (error: any) {
    console.error("PREDICT ERROR:", error?.message || error);
    const { statusCode, body } = apiErrors.handleApiErrors(error);
    return res.status(statusCode).json(typeof body === 'string' ? JSON.parse(body) : body);
  }
};


const toNumber = (val: any) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : NaN;
};

const predictCropRecommendation = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      throw apiErrors.badRequest(constMessages.emptyBody);
    }

    const {
      nitrogen,
      phosphorus,
      potassium,
      temperature,
      humidity,
      ph,
      rainfall,
    } = req.body;

    // ✅ validate required fields exist
    if (
      nitrogen === undefined ||
      phosphorus === undefined ||
      potassium === undefined ||
      temperature === undefined ||
      humidity === undefined ||
      ph === undefined ||
      rainfall === undefined
    ) {
      throw apiErrors.badRequest(constMessages.EmptyFields);
    }

    // ✅ convert to numbers (Postman sometimes sends strings)
    const payload = {
      nitrogen: toNumber(nitrogen),
      phosphorus: toNumber(phosphorus),
      potassium: toNumber(potassium),
      temperature: toNumber(temperature),
      humidity: toNumber(humidity),
      ph: toNumber(ph),
      rainfall: toNumber(rainfall),
    };

    // ✅ numeric validation
    const hasNaN = Object.values(payload).some((v) => Number.isNaN(v));
    if (hasNaN) {
      throw apiErrors.badRequest("All fields must be valid numbers");
    }

    // ✅ Call HuggingFace Space
    const client = await Client.connect("rsj56/crop-recommendation");

    const result = await client.predict("/predict", payload);

    return res.status(codes.ok).json({
      status: constMessages.success,
      message: "Crop recommendation successful",
      data: result.data,
    });
  } catch (error: unknown) {
    const { statusCode, body } = apiErrors.handleApiErrors(error);
    return res.status(statusCode).json(typeof body === 'string' ? JSON.parse(body) : body);
  }
};

export const homeControllers = {
  predictCropDisease,
    predictCropRecommendation,
};
