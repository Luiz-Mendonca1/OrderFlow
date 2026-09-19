import { Request, Response } from "express";
import { UpdateProductService } from "../../services/product/UpdateProductService";

class UpdateProductController {
    async handle(req: Request, res: Response) {
        const { id, name, description, price, category_id } = req.body;
        const file = req.file as (Express.Multer.File & { buffer: Buffer }) | undefined;

        try {
            const product = await new UpdateProductService().execute({
                id,
                name,
                description,
                price: Number(price),
                category_id,
                imageBuffer: file?.buffer,
                imageName: file?.originalname,
            });
            return res.status(200).json(product);
        } catch (error) {
            return res.status(400).json({ error: error instanceof Error ? error.message : "Failed to update product." });
        }
    }
}

export { UpdateProductController };