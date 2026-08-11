import prismaClient from "../../prisma";

interface CreateOrderServiceProps {
  table: number;
}

class CreateOrderService {
  async execute({ table }: CreateOrderServiceProps) {
    try {
      const order = await prismaClient.order.create({
        data: {
          table,
        },
        select: {
          id: true,
          table: true,
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