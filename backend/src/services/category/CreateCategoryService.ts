// createcategoryservice serve para lidar com a lógica de criação de novas categorias. Ele recebe um nome de categoria, verifica se já existe uma categoria com o mesmo nome no banco de dados e, se não existir, cria uma nova categoria. Se a criação for bem-sucedida, retorna os detalhes da categoria criada. Caso ocorra algum erro, lança uma exceção com uma mensagem de erro correspondente.
import prismaClient from "../../prisma";
import { getOrganizationId } from "../../prisma/tenantContext";

interface CreateCategoryProps {
    name: string;
}

class CreateCategoryService {
    async execute({ name }: CreateCategoryProps) {
        try {
            const organizationId = getOrganizationId();
            if (!organizationId) throw new Error("Organization context is missing.");

            const categoryAlreadyExists = await prismaClient.category.findFirst({
                where: {
                    name: name
                }
            });

            if (categoryAlreadyExists) {
                throw new Error("Category already exists.");
            }

            const category = await prismaClient.category.create({
                data: {
                    name,
                    organizationId
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                }
            });

            return category;
        } catch (error) {
            console.error('Error creating category:', error);
            throw new Error(error instanceof Error ? error.message : "Failed to create category.");
        }
    }
}

export { CreateCategoryService };