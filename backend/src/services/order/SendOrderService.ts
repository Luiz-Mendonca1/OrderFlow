import prismaClient from "../../prisma";

interface DetailOrderProps {
    orderId: string;
}

class SendOrderService {
    async execute({ orderId }: DetailOrderProps) {
        try {
            const order = await prismaClient.order.findFirst({ 
                where: {
                    id: orderId
                }
            });

            if (!order) {
                throw new Error("Order not found");
            }

            const updatedOrder = await prismaClient.order.update({
                where: {
                    id: orderId
                },
                data: {
                    draft: false,
                    status: true},
                select: {
                    id: true,
                    table: true,
                    status: true,
                    draft: true,
                    createdAt: true,
                }
            });

            return updatedOrder;
        
        } catch (error) {
            throw new Error("Error sending order");
        }
    }
}

export { SendOrderService };