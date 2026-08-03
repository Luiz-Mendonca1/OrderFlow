import prismaClient from "../../prisma";

interface DeleteProductServiceProps {
  id: string;
}

class DeleteProductService {
  async execute({ id }: DeleteProductServiceProps) {
    try {
      const product = await prismaClient.product.update({
        where: {
          id,
        },
        data: {
          disabled: true,
        },
      });
      return { product, mensagem: "Product disabled successfully" };
    } catch (error) {
      throw new Error("Product not found");
    }
  }
}

export { DeleteProductService };