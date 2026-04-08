import mongoose, { Document, Schema } from "mongoose";

export interface IMovement extends Document {
  type: "entrada" | "salida";
  quantity: number;
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  supplier?: string;
  reason?: string;
  date: Date;
}

const MovementSchema = new Schema<IMovement>(
  {
    type: { type: String, enum: ["entrada", "salida"], required: true },
    quantity: { type: Number, required: true, min: 1 },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    supplier: { type: String, trim: true },
    reason: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model<IMovement>("Movement", MovementSchema);
