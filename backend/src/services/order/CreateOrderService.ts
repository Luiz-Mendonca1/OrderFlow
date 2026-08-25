import prismaClient from "../../prisma";

interface CreateOrderServiceProps {
  table: number;
  name?: string;
}

class CreateOrderService {
  async execute({ table, name }: CreateOrderServiceProps) {
    try {
      const order = await prismaClient.order.create({
        data: {
          table,
          name,
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