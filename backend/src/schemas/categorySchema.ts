import {z} from 'zod';

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, { message: 'Name is required' }),
    }),
});

export const updateCategorySchema = z.object({
    body: z.object({
        id: z.string().min(1, { message: 'Category id is required' }),
        name: z.string().min(1, { message: 'Name is required' }),
    }),
});

export const deleteCategorySchema = z.object({
    query: z.object({
        category_id: z.string().min(1, { message: 'Category id is required' }),
    }),
});