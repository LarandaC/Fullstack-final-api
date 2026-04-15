import Movement, { IMovement, MovementStatus } from "../models/Movement";
import type {
  IMovementRepository,
  CreateCompraData,
  CreateBajaData,
} from "../interfaces/repositories/IMovementRepository";
import { FilterUtils, type MovementFilters } from "../utils/FilterUtils";

const POPULATE_ITEMS = { path: "items.product", select: "name sku unit" };
const POPULATE_CREATED_BY = { path: "createdBy", select: "name email" };
const POPULATE_APPROVED_BY = { path: "approvedBy", select: "name email" };

export class MovementRepository implements IMovementRepository {
  async findAll(filters?: MovementFilters): Promise<IMovement[]> {
    const query = filters ? FilterUtils.buildMovementQuery(filters) : {};

    return Movement.find(query)
      .populate(POPULATE_ITEMS)
      .populate(POPULATE_CREATED_BY)
      .populate(POPULATE_APPROVED_BY)
      .sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IMovement | null> {
    return Movement.findById(id)
      .populate(POPULATE_ITEMS)
      .populate(POPULATE_CREATED_BY)
      .populate(POPULATE_APPROVED_BY);
  }

  async findByProduct(productId: string): Promise<IMovement[]> {
    return Movement.find({ "items.product": productId })
      .populate(POPULATE_ITEMS)
      .populate(POPULATE_CREATED_BY)
      .populate(POPULATE_APPROVED_BY)
      .sort({ createdAt: -1 });
  }

  async createCompra(data: CreateCompraData): Promise<IMovement> {
    const doc = new Movement({
      type: "compra",
      status: "aprobado",
      items: data.items,
      notes: data.notes,
      supplier: data.supplier,
      createdBy: data.createdBy,
      approvedBy: data.createdBy,
      approvedAt: new Date(),
      date: data.date ?? new Date(),
    });
    await doc.save();
    return doc.populate([POPULATE_ITEMS, POPULATE_CREATED_BY]);
  }

  async createBaja(data: CreateBajaData): Promise<IMovement> {
    const doc = new Movement({
      type: "baja",
      status: "pendiente",
      items: data.items,
      notes: data.notes,
      createdBy: data.createdBy,
      date: data.date ?? new Date(),
    });
    await doc.save();
    return doc.populate([POPULATE_ITEMS, POPULATE_CREATED_BY]);
  }

  async updateStatus(
    id: string,
    status: MovementStatus,
    approverId: string,
  ): Promise<IMovement | null> {
    return Movement.findByIdAndUpdate(
      id,
      { status, approvedBy: approverId, approvedAt: new Date() },
      { new: true },
    )
      .populate(POPULATE_ITEMS)
      .populate(POPULATE_CREATED_BY)
      .populate(POPULATE_APPROVED_BY);
  }
}
