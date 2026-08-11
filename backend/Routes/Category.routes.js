import { Router } from "express";
import { getCategories } from "../Controler/Category.controler.js";

const categoryRouter = Router();

categoryRouter.get("/", getCategories);

export default categoryRouter;
