import {Request, Response} from "express";
import {DetailOrderService} from "../../services/order/DetailOrderService";

class DetailOrderController {
    async handle(req: Request, res: Response) {
        const orderId = req.query.orderId as string;
        const detailOrderService = new DetailOrderService();
        const order = await detailOrderService.execute({ orderId });
        return res.status(200).json(order);
    }
}

export { DetailOrderController };