import { Request, Response } from "express";
import { DeleteCategoryService } from "../../services/category/DeleteCategoryService";

class DeleteCategoryController {
    async handle(req: Request, res: Response) {
        const id = req.query.category_id as string;
        const deleteCategory = new DeleteCategoryService();

        try {
            const result = await deleteCategory.execute({ id });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ error: error instanceof Error ? error.message : "Category not found" });
        }
    }
}

export { DeleteCategoryController };