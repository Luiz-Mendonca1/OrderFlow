import prismaClient from "../../prisma";

interface ListOrderServiceProps {
  draft?: string;
}

class ListOrderService {
  async execute({ draft }: ListOrderServiceProps) {
    const orders = await prismaClient.order.findMany({
      where: {
        draft: draft === "true",
      },
      select: {
        id: true,
        table: true,
        draft: true,
        status: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            amount: true,
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                banner: true,
              },
            },
          },
        },
      },
    });

    return orders;
  }
}

export { ListOrderService };