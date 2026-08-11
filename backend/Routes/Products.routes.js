import { Router } from "express";
import { getProducts, getFeaturedProducts, getProductById } from "../Controler/Products.controler.js";

const productsRouter = Router();

// NOTE: /featured must be declared BEFORE /:id to avoid "featured" being treated as an ID
productsRouter.get("/featured", getFeaturedProducts);
productsRouter.get("/", getProducts);
productsRouter.get("/:id", getProductById);

export default productsRouter;
