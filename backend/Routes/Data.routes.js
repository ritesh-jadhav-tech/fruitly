import { Router } from "express";
import { authMiddleware } from "../middleware/Auth.middleware.js";
import { getData , updateData } from "../Controler/Data.controler.js";
const datarouter = Router();

datarouter.get("/",authMiddleware,getData);
datarouter.put("/update",authMiddleware,updateData);

export default datarouter;