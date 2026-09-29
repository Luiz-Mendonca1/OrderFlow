import prismaClient from "../../prisma";
import { getOrganizationId } from "../../prisma/tenantContext";

interface RemoveItemProps {
    itemId: string;
}

export class RemoveItemOrderService {
    async execute({ itemId }: RemoveItemProps) {
        try {   
        const organizationId = getOrganizationId();
        if (!organizationId) throw new Error("Organization context is missing.");

        const result = await prismaClient.item.deleteMany({
            where: {
                id: itemId,
                order: { organizationId },
            },
        });

        if (result.count === 0) {
            throw new Error("Item not found.");
        }

        return { message: "Item removed successfully." };
    }
    catch (error) {
        console.error("Error removing item:", error);
        throw new Error("Item not found or could not be deleted.");
    }
}
}
