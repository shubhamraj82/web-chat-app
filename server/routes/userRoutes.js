import express from "express";
import { checkAuth, logIn, signUp, updateProfile } from "../controller/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup",signUp);
userRouter.post("/login",logIn);
userRouter.put("/update-profile",protectRoute, updateProfile);
userRouter.get("/check-auth",protectRoute,checkAuth);

export default userRouter;