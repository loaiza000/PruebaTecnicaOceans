import express from "express";
import cors from "cors";
import morgan from "morgan";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.listen(app.get("port"), () => {
  console.log(`servidor levantado en el puerto ${app.get("port")}`);
});
