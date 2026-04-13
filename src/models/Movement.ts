import mongoose, { Document, Schema } from "mongoose";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export const MOVEMENT_TYPES = ["compra", "baja"] as const;
export type MovementType = (typeof MOVEMENT_TYPES)[number];

export const MOVEMENT_STATUSES = ["pendiente", "aprobado", "rechazado"] as const;
export type MovementStatus = (typeof MOVEMENT_STATUSES)[number];

export const BAJA_REASONS = ["daño", "vencimiento", "descontinuado", "otro"] as const;
export type BajaReason = (typeof BAJA_REASONS)[number];

// ─── Item embebido ─────────────────────────────────────────────────────────────

export interface IMovementItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  // Campos para compra (opcionales)
  purchasePrice?: number;
  salePrice?: number;
  // Campos para baja (opcionales)
  reason?: BajaReason;
  reasonDetail?: string;
}

const MovementItemSchema = new Schema<IMovementItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    // compra
    purchasePrice: { type: Number, min: 0 },
    salePrice: { type: Number, min: 0 },
    // baja
    reason: { type: String, enum: BAJA_REASONS },
    reasonDetail: { type: String, trim: true },
  },
  { _id: false },
);

// ─── Documento principal ───────────────────────────────────────────────────────

export interface IMovement extends Document {
  type: MovementType;
  items: IMovementItem[];
  status: MovementStatus;
  notes?: string;
  supplier?: string;
  createdBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MovementSchema = new Schema<IMovement>(
  {
    type: { type: String, enum: MOVEMENT_TYPES, required: true },
    items: { type: [MovementItemSchema], required: true, validate: (v: IMovementItem[]) => v.length > 0 },
    status: { type: String, enum: MOVEMENT_STATUSES, default: "pendiente" },
    notes: { type: String, trim: true },
    supplier: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model<IMovement>("Movement", MovementSchema);
