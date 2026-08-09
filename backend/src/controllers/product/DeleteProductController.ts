import { Request, Response } from "express";
import { DeleteProductService } from "../../services/product/DeleteProductService";

class DeleteProductController {
  async handle(req: Request, res: Response) {
    const id = req.query.id as string;

    const deleteProductService = new DeleteProductService();
    const result = await deleteProductService.execute({ id });

    return res.status(200).json(result);
  }
}

export { DeleteProductController };