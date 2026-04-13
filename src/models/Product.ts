import mongoose, { Document, Schema } from "mongoose";

export const UNIT_VALUES = ["kg", "g", "un", "lt"] as const;
export type UnitType = (typeof UNIT_VALUES)[number];

export interface IProduct extends Document {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category: mongoose.Types.ObjectId;
  purchasePrice: number;
  salePrice: number;
  image?: string;
  isWeighable: boolean;
  unit: UnitType;
  iva: number;
  stock: number;
  minStock: number;
  maxStock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    barcode: { type: String, sparse: true, unique: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    purchasePrice: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, required: true, min: 0 },
    image: { type: String, trim: true },
    isWeighable: { type: Boolean, default: false },
    unit: { type: String, enum: UNIT_VALUES, required: true },
    iva: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    minStock: { type: Number, default: 0, min: 0 },
    maxStock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

export default mongoose.model<IProduct>("Product", ProductSchema);
