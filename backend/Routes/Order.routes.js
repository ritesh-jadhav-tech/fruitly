import { Router } from "express";
import { makeOrder, getMyOrders, getOrderById, cancelOrder } from "../Controler/Order.controler.js";
import { authMiddleware } from "../middleware/Auth.middleware.js";

const OrderRouter = Router();

OrderRouter.post("/data",        authMiddleware, makeOrder);
OrderRouter.get("/my",           authMiddleware, getMyOrders);
OrderRouter.get("/:id",          authMiddleware, getOrderById);
OrderRouter.put("/:id/cancel",   authMiddleware, cancelOrder);

export default OrderRouter;