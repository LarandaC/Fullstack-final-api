import mongoose from "mongoose";
import { env } from "./env";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error al conectar MongoDB:", (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;
