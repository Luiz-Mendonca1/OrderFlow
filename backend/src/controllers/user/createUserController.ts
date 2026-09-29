import {Request, Response} from 'express';
import {CreateUserService} from '../../services/user/CreateUserService';

class CreateUserController {
    async handle(req: Request, res: Response) {
        const { name, email, password, organizationName } = req.body;

        const createUserService = new CreateUserService();

        try {
            const user = await createUserService.execute({ name, email, password, organizationName });
            return res.status(201).json(user);
        } catch (error) {
            console.error('Error creating user:', error);
            if (error instanceof Error && 'statusCode' in error) {
                const statusCode = Number((error as Error & { statusCode?: number }).statusCode || 500);
                return res.status(statusCode).json({ error: error.message });
            }

            if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
                return res.status(409).json({ error: "Este e-mail já foi cadastrado." });
            }

            return res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }
}

export { CreateUserController };