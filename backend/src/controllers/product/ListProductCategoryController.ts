import { Request, Response } from "express";
import { ListProductCategoryService } from "../../services/product/ListProductCategoryService";

class ListProductCategoryController {
  async handle(req: Request, res: Response) {
    const category_id = req.query.category_id as string;

    const listProductCategoryService = new ListProductCategoryService();
    const products = await listProductCategoryService.execute({ category_id });

    return res.status(200).json(products);
  }
}

export { ListProductCategoryController };