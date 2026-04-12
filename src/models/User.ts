import mongoose, { Document, Schema } from "mongoose";
import { ROLES, type UserRole } from "../types/roles";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

const ROLE_VALUES = Object.values(ROLES);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ROLE_VALUES,
      default: ROLES.INVENTARISTA,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", UserSchema);
