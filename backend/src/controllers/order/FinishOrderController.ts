import {Request, Response} from "express";
import { FinishOrderService } from "../../services/order/FinishOrderService";

class FinishOrderController {
    async handle(req: Request, res: Response) {
        const orderId = req.body.orderId as string;
        const finishOrderService = new FinishOrderService();
        const order = await finishOrderService.execute({ orderId });
        return res.status(200).json(order);
    }
}
export { FinishOrderController };