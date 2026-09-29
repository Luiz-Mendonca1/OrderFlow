import {z} from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(1, { message: 'Name is required' }),
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
        organizationName: z.string().trim().min(2, { message: 'Informe o nome do estabelecimento' }),
    }),
});

export const authUserSchema = z.object({
    body: z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    }),
});

export const createStaffSchema = z.object({
    body: z.object({
        name: z.string().trim().min(1),
        email: z.string().email(),
        password: z.string().min(6),
    }),
});
