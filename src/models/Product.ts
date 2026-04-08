import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  sku: string;
  category: string;
  stock: number;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model<IProduct>("Product", ProductSchema);
