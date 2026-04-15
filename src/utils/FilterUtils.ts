export interface MovementFilters {
  type?: string;
  status?: string;
  createdBy?: string;
  startDate?: string;
  endDate?: string;
}

export class FilterUtils {
  static buildMovementQuery(filters: MovementFilters): Record<string, any> {
    const query: Record<string, any> = {};

    if (filters.type && filters.type !== "todos") {
      query.type = filters.type;
    }

    if (filters.status && filters.status !== "todos") {
      query.status = filters.status;
    }

    if (filters.createdBy && filters.createdBy !== "todos") {
      query.createdBy = filters.createdBy;
    }

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    return query;
  }
}
