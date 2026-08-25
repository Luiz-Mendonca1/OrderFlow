import prismaClient from "../../prisma";

interface DeleteOrderProps {
    orderId: string;
}

class DeleteOrderService {
    async execute({ orderId }: DeleteOrderProps) {
        try {
            const order = await prismaClient.order.findFirst({ 
                where: {
                    id: orderId
                }
            });

            if (!order) {
                throw new Error("Fail to delete order. Order not found.");
            }

            const deletedOrder = await prismaClient.order.delete({
                where: {
                    id: orderId
                }
            });

            return deletedOrder;
        
        } catch (error) {
            throw new Error("Error deleting order");
        }
    }
}

export { DeleteOrderService };