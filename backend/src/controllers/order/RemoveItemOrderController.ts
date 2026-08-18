import { Request, Response } from 'express';
import { RemoveItemOrderService } from '../../services/order/RemoveItemOrderService';

class RemoveItemOrderController {
  async handle(req: Request, res: Response) {
    const itemId = req.query.itemId as string;

    const removeItemOrderService = new RemoveItemOrderService();
    const result = await removeItemOrderService.execute({ itemId: itemId });

    return res.status(200).json(result);
  }
}

export { RemoveItemOrderController };