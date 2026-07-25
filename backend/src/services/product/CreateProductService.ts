import prismaClient from "../../prisma";
import cloudinary from "../../config/cloudinary";

interface CreateProductServiceProps {
    name: string;
    description: string;
    price: number;
    category_id: string;
    imageBuffer: Buffer;
    imageName: string;
}

class CreateProductService {
    async execute({ name, description, price, category_id, imageBuffer, imageName }: CreateProductServiceProps) {
        if (!category_id) {
            throw new Error('Category id is required');
        }

        const categoryExists = await prismaClient.category.findUnique({
            where: {
                id: category_id,
            },
        });

        if (!categoryExists) {
            throw new Error('Category not found');
        }

        // envia para o cloudinary e pega url
        let bannerUrl = '';

        try {
            const result = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'products',
                        resource_type: 'image',
                        public_id: `${Date.now()}_${imageName.split('.')[0]}`,
                    },
                    (error: any, result: any) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                uploadStream.end(imageBuffer);
            });

            console.log(result);
            bannerUrl = result?.secure_url || result?.url || '';

            const product = await prismaClient.product.create({
                data: {
                    name,
                    description,
                    price,
                    banner: bannerUrl,
                    category: { connect: { id: category_id } },
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    banner: true,
                    category_id: true,
                    created_at: true,
                },
            });

            return product;
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw new Error('Failed to upload image');
        }
    }

}

export { CreateProductService };