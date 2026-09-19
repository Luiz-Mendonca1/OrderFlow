import { Request, Response } from "express";
import { UpdateCategoryService } from "../../services/category/UpdateCategoryService";

class UpdateCategoryController {
    async handle(req: Request, res: Response) {
        const { id, name } = req.body;
        const updateCategory = new UpdateCategoryService();

        try {
            const category = await updateCategory.execute({ id, name });
            return res.status(200).json(category);
        } catch (error) {
            return res.status(400).json({ error: error instanceof Error ? error.message : "Failed to update category." });
        }
    }
}

export { UpdateCategoryController };