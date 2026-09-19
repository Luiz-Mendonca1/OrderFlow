import {Request, Response, NextFunction} from 'express';
import prismaClient from '../prisma';

// essa variavel é usada para verificar se o usuário autenticado é um administrador. Se o usuário não estiver autenticado, não for encontrado ou não tiver a função de administrador, a função retornará uma resposta de erro apropriada. Caso contrário, a função chamará `next()` para passar o controle para o próximo middleware ou rota.
export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user_id = req.user_id;

    // Check if the user is an admin
    if(!user_id) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            id: user_id,
        }
    });

    if (!user) {
        res.status(403).json({ error: 'User not found or not an admin' });
        return;
    }

    if(user.role !== 'ADMIN') {
        res.status(403).json({ error: 'User is not an admin' });
        return;
    }

    next();
};