import {Request, Response, NextFunction} from 'express';

// essa variavel é usada para verificar se o usuário autenticado é um administrador. Se o usuário não estiver autenticado, não for encontrado ou não tiver a função de administrador, a função retornará uma resposta de erro apropriada. Caso contrário, a função chamará `next()` para passar o controle para o próximo middleware ou rota.
export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user_id) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    if (req.role !== 'ADMIN') {
        res.status(403).json({ error: 'User is not an admin' });
        return;
    }

    next();
};