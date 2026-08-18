import prismaClient from "../../prisma";

interface RemoveItemProps {
    item_id: string;
}

export class RemoveItemOrderService {
    async execute({ item_id }: RemoveItemProps) {
        try {   
        const item = await prismaClient.item.findFirst({
            where: {
                id: item_id
            }
        });

        if (!item) {
            throw new Error("Item not found.");
        }

        await prismaClient.item.delete({
            where: {
                id: item_id
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
