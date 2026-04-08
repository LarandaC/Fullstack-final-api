import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error al conectar MongoDB:", (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;
