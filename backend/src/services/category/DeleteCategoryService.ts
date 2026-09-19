import prismaClient from "../../prisma";

interface DeleteCategoryProps {
    id: string;
}

class DeleteCategoryService {
    async execute({ id }: DeleteCategoryProps) {
        try {
            await prismaClient.category.delete({ where: { id } });
            return { mensagem: "Category deleted successfully" };
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Category not found");
        }
    }
}

export { DeleteCategoryService };