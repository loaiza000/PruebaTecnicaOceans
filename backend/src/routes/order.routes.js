import { Router } from "express";
import orderController from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.get("/", orderController.getAllOrders);
orderRouter.get("/search", orderController.searchOrder);
orderRouter.get("/:id", orderController.getByIdOrder);
orderRouter.post("/", orderController.createOrder);
orderRouter.put("/:id", orderController.updateOrder);

export default orderRouter;
