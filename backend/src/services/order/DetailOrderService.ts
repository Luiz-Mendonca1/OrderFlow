import prismaClient from "../../prisma";

interface DetailOrderProps {
    orderId: string;
}

class DetailOrderService {
    async execute({ orderId }: DetailOrderProps) {
        try {
            const order = await prismaClient.order.findFirst({
                where: {
                    id: orderId
                },
                select: {
                    id: true,
                    table: true,
                    status: true,
                    draft: true,
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
                                    banner: true
                                }
                            }
                        }
                    }
                }
            });

            if (!order) {
                throw new Error("Order not found.");
            }
            return order;
        } catch (error) {
            console.error("Error fetching order details:", error);
            throw new Error("Failed to fetch order details.");
        }
    }
}

export { DetailOrderService };