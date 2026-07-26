import {z} from "zod";

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, { message: "Name is required" }),
        description: z.string().min(1, { message: "Description is required" }),
        price: z.coerce.number().positive({ message: "Price must be a positive number" }),
        category_id: z.string().optional(),
    })
});