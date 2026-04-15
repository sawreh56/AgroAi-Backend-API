import { Request,Response, Router } from "express";
import { authControllers } from "../controllers/auth.controllers";
import uploadImage from "../middlewares/uploadImage.middleware";

const router=Router();

router.get("/health",(req:Request,res:Response)=>{
    res.send("Api working properly")
})

router.post("/register_farmer",uploadImage,authControllers.farmerRegisteration)
router.post("/register_expert",uploadImage,authControllers.expertRegisteration)
router.post("/login",authControllers.userLogin)
router.post("/verify_otp",authControllers.verifyOtp)
router.post("/delete_account",authControllers.deleteAccount)
router.put("/update_farmer",uploadImage,authControllers.updateFarmer)
router.put("/update_expert",uploadImage,authControllers.updateExpert)



export default router;