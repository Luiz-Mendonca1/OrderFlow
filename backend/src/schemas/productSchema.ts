import {z} from "zod";

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, { message: "Name is required" }),
        description: z.string().min(1, { message: "Description is required" }),
        price: z.coerce.number().positive({ message: "Price must be a positive number" }),
        category_id: z.string().optional(),
    })
});

export const listProductSchema = z.object({
    query: z.object({
        disabled: z
        .enum(['true', 'false'],
            {message: "Disabled must be either 'true' or 'false'"})
        .optional()
        .default('false')
        .transform((value) => value === 'true'),
    })
});

export const updateProductSchema = z.object({
    body: z.object({
        id: z.string().min(1, { message: "Product id is required" }),
        name: z.string().min(1, { message: "Name is required" }),
        description: z.string().min(1, { message: "Description is required" }),
        price: z.coerce.number().positive({ message: "Price must be a positive number" }),
        category_id: z.string().min(1, { message: "Category id is required" }),
    }),
});