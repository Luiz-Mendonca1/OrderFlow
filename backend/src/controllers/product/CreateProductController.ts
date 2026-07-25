import {Request, Response } from 'express';
import { CreateProductService } from '../../services/product/CreateProductService';

class CreateProductController {
    async handle(req: Request, res: Response) {
        const { name, description, price } = req.body;
        const category_id = req.body.category_id ?? req.body.categoryId;

        if (!req.file) {
            return res.status(400).json({ error: 'File is required' });
        }

        if (!category_id) {
            return res.status(400).json({ error: 'Category id is required' });
        }

        const createProduct = new CreateProductService();

        try {
            const file = req.file as Express.Multer.File & { buffer: Buffer };
            const product = await createProduct.execute({
                name,
                description,
                price: Number(price),
                category_id,
                imageBuffer: file.buffer,
                imageName: file.originalname,
            });

            return res.status(201).json(product);
        } catch (error: any) {
            console.error('Error creating product:', error);
            return res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}

export { CreateProductController };