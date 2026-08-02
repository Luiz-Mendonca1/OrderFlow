import prismaClient from "../../prisma";

interface ListProductServiceProps {
    disabled: boolean;
}

class ListProductService {
    async execute({ disabled }: ListProductServiceProps) {
        try {
            const products = await prismaClient.product.findMany({
                where: {
                    disabled,
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
        createdAt: 'desc',
    },
})
    return products;
} catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
}
    }}

export { ListProductService };