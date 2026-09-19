import prismaClient from "../../prisma";

interface UpdateCategoryProps {
    id: string;
    name: string;
}

class UpdateCategoryService {
    async execute({ id, name }: UpdateCategoryProps) {
        try {
            const categoryAlreadyExists = await prismaClient.category.findFirst({
                where: {
                    name,
                    NOT: { id },
                },
            });

            if (categoryAlreadyExists) {
                throw new Error("Já existe uma categoria com esse nome.");
            }

            const category = await prismaClient.category.update({
                where: { id },
                data: { name },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                },
            });

            return category;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Failed to update category.");
        }
    }
}

export { UpdateCategoryService };