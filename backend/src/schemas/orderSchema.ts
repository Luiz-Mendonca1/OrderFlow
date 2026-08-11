import {z} from "zod";

export const orderSchema = z.object({
    body: z.object({
        table: z
            .number({message: "Number of table is required"})
            .int({message: "Number of table must be an integer"})
            .positive({message: "Number of table must be a positive integer"}),
        name: z.string().optional()
    })
});