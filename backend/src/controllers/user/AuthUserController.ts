import { Request, Response } from 'express';
import { AuthUserService } from '../../services/user/AuthUserService';

class AuthUserController {
    async handle(req: Request, res: Response) {
        const { email, password } = req.body;

        const authService = new AuthUserService();

        try {
            const session = await authService.execute({ email, password });

            return res.json(session);
        } catch {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }
    }
}

export { AuthUserController };