import prismaClient from "../../prisma";

interface FinishOrderProps {
    orderId: string;
}

class FinishOrderService {
    async execute({ orderId }: FinishOrderProps) {
        try {
            const order = await prismaClient.order.findFirst({ 
                where: {
                    id: orderId
                }
            });

            if (!order) {
                throw new Error("Fail to finish order. Order not found.");
            }

            const updatedOrder = await prismaClient.order.update({
                where: {
                    id: orderId
                },
                data: {
                    status: true},
                select: {
                    id: true,
                    table: true,
                    name: true,
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

export { FinishOrderService };