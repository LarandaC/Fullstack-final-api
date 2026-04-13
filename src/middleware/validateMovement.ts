import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { BAJA_REASONS } from "../models/Movement";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isValidObjectId = (id: unknown) =>
  typeof id === "string" && mongoose.Types.ObjectId.isValid(id);

const isPositiveInt = (n: unknown) => typeof n === "number" && Number.isInteger(n) && n > 0;

// ─── Compra ───────────────────────────────────────────────────────────────────

export const validateCreateCompra = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { items, supplier, notes } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: "Se requiere al menos un ítem en la compra" });
    return;
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!isValidObjectId(item.product)) {
      res.status(400).json({ message: `Ítem ${i + 1}: product debe ser un ID válido` });
      return;
    }

    if (!isPositiveInt(item.quantity)) {
      res.status(400).json({ message: `Ítem ${i + 1}: quantity debe ser un entero positivo` });
      return;
    }

    if (item.purchasePrice !== undefined && (typeof item.purchasePrice !== "number" || item.purchasePrice < 0)) {
      res.status(400).json({ message: `Ítem ${i + 1}: purchasePrice debe ser un número no negativo` });
      return;
    }

    if (item.salePrice !== undefined && (typeof item.salePrice !== "number" || item.salePrice < 0)) {
      res.status(400).json({ message: `Ítem ${i + 1}: salePrice debe ser un número no negativo` });
      return;
    }
  }

  if (supplier !== undefined && (typeof supplier !== "string" || supplier.trim() === "")) {
    res.status(400).json({ message: "supplier debe ser un texto no vacío" });
    return;
  }

  if (notes !== undefined && typeof notes !== "string") {
    res.status(400).json({ message: "notes debe ser un texto" });
    return;
  }

  next();
};

// ─── Baja ─────────────────────────────────────────────────────────────────────

export const validateCreateBaja = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { items, notes } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: "Se requiere al menos un ítem en la baja" });
    return;
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!isValidObjectId(item.product)) {
      res.status(400).json({ message: `Ítem ${i + 1}: product debe ser un ID válido` });
      return;
    }

    if (!isPositiveInt(item.quantity)) {
      res.status(400).json({ message: `Ítem ${i + 1}: quantity debe ser un entero positivo` });
      return;
    }

    if (!item.reason || !BAJA_REASONS.includes(item.reason)) {
      res.status(400).json({
        message: `Ítem ${i + 1}: reason es requerido y debe ser uno de: ${BAJA_REASONS.join(", ")}`,
      });
      return;
    }

    if (item.reasonDetail !== undefined && typeof item.reasonDetail !== "string") {
      res.status(400).json({ message: `Ítem ${i + 1}: reasonDetail debe ser un texto` });
      return;
    }
  }

  if (notes !== undefined && typeof notes !== "string") {
    res.status(400).json({ message: "notes debe ser un texto" });
    return;
  }

  next();
};
