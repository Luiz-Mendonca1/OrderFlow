import prismaClient from "../../prisma";
import cloudinary from "../../config/cloudinary";

interface UpdateProductProps {
    id: string;
    name: string;
    description: string;
    price: number;
    category_id: string;
    imageBuffer?: Buffer;
    imageName?: string;
}

class UpdateProductService {
    async execute({ id, name, description, price, category_id, imageBuffer, imageName }: UpdateProductProps) {
        const categoryExists = await prismaClient.category.findUnique({ where: { id: category_id } });
        if (!categoryExists) throw new Error("Category not found");

        let banner: string | undefined;
        if (imageBuffer && imageName) {
            banner = await new Promise<string>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "products", resource_type: "image", public_id: `${Date.now()}_${imageName.split(".")[0]}` },
                    (error, result) => {
                        if (error) reject(new Error("Failed to upload image"));
                        else resolve(result?.secure_url || result?.url || "");
                    },
                );
                uploadStream.end(imageBuffer);
            });
        }

        try {
            return await prismaClient.product.update({
                where: { id },
                data: {
                    name,
                    description,
                    price,
                    categoryId: category_id,
                    ...(banner !== undefined ? { banner } : {}),
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    banner: true,
                    disabled: true,
                    categoryId: true,
                    createdAt: true,
                    category: { select: { id: true, name: true } },
                },
            });
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Product not found");
        }
    }
}

export { UpdateProductService };