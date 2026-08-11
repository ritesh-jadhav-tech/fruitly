import { Router } from "express";
import { authMiddleware } from "../middleware/Auth.middleware.js";
import { feedback } from "../Controler/Info.controler.js"

const InfoRouter = Router();

InfoRouter.post("/data",authMiddleware,feedback)

export default InfoRouter;