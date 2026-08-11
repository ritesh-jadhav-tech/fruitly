import { Router } from "express";
import { authMiddleware } from "../middleware/Auth.middleware.js";
import {
  requireVendor, getStats, getUsers, updateUser, deleteUser,
  getAllOrders, updateOrderStatus,
} from "../Controler/Admin.controler.js";

const adminRouter = Router();

// All admin routes require authentication + Vendor role
adminRouter.use(authMiddleware, requireVendor);

adminRouter.get("/stats",               getStats);
adminRouter.get("/users",               getUsers);
adminRouter.put("/users/:id",           updateUser);
adminRouter.delete("/users/:id",        deleteUser);
adminRouter.get("/orders",              getAllOrders);
adminRouter.put("/orders/:id/status",   updateOrderStatus);

export default adminRouter;
