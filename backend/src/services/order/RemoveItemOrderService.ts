import prismaClient from "../../prisma";

interface RemoveItemProps {
    itemId: string;
}

export class RemoveItemOrderService {
    async execute({ itemId }: RemoveItemProps) {
        try {   
        const item = await prismaClient.item.findFirst({
            where: {
                id: itemId
            }
        });

        if (!item) {
            throw new Error("Item not found.");
        }

        await prismaClient.item.delete({
            where: {
                id: itemId
            }
        });

        return { message: "Item removed successfully." };
    }
    catch (error) {
        console.error("Error removing item:", error);
        throw new Error("Item not found or could not be deleted.");
    }
}
}
