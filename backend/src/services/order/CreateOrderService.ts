import prismaClient from "../../prisma";
import { getOrganizationId } from "../../prisma/tenantContext";

interface CreateOrderServiceProps {
  table: number;
  name?: string;
}

class CreateOrderService {
  async execute({ table, name }: CreateOrderServiceProps) {
    try {
      const organizationId = getOrganizationId();
      if (!organizationId) throw new Error("Organization context is missing.");

      const order = await prismaClient.order.create({
        data: {
          table,
          name,
          organizationId,
        },
        select: {
          id: true,
          table: true,
          name: true,
          status: true,
          draft: true,
          createdAt: true, 
        },
      });

      return order;
    } catch (error) {
      throw new Error("Error creating order");
    }
  }
}

export { CreateOrderService };