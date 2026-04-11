import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import movementRoutes from "./routes/movementRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/movements", movementRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

export default app;
