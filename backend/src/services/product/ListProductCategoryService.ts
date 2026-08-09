import prismaClient from "../../prisma";

//faz a leitura dos produtos de uma categoria específica no banco de dados

interface ListProductCategoryServiceProps {
  category_id: string;
}

class ListProductCategoryService {
  async execute({ category_id }: ListProductCategoryServiceProps) {
    try {
      const category = await prismaClient.category.findUnique({
        where: {
          id: category_id,
        },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      const products = await prismaClient.product.findMany({
        where: {
          categoryId: category_id, 
          disabled: false,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          banner: true,
          disabled: true,
          createdAt: true,
          categoryId: true, 
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return products;
    } catch (error) {
      throw new Error("Error while fetching products for category");
    }
  }
}

export { ListProductCategoryService };