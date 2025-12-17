import { Router } from "express";
import productController from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.get("/", productController.getAllProducts);
productRouter.get("/search", productController.searchProduct);
productRouter.get("/:id", productController.getByIdProduct);
productRouter.post("/", productController.createProduct);
productRouter.put("/:id", productController.updateProduct);

export default productRouter;
