import prismaClient from "../../prisma";

interface ItemProps {
    orderId: string;
    productId: string;
    amount: number;
} 

class AddItemOrderService {
    async execute({ orderId, productId, amount }: ItemProps) {
        try {
            const order = await prismaClient.order.findFirst({
                where: {
                    id: orderId,
                    draft: true
                }
            });

            if (!order) {
                throw new Error("Order not found or already finalized");
            }

            const product = await prismaClient.product.findFirst({
                where: {
                    id: productId
                }
            });

            if (!product) {
                throw new Error("Product not found");
            }

            const item = await prismaClient.item.create({
                data: {
                    orderId: orderId,
                    productId: productId,
                    amount: amount
                }
            });

            return item;
        } catch (error) {
            throw new Error("Error adding item to order");
        }
    }
}

export { AddItemOrderService };