import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodError, ZodType } from 'zod';

export const validateSchema = (schema: ZodType): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Erro de validação nos dados enviados.',
          details: error.issues.map((issue) => ({
            field: issue.path.slice(1).join('.'), 
            location: issue.path[0], 
            message: issue.message,
          })),
        });
      }

      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  };