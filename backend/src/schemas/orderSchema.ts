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

export const createOrderSchema = z.object({
    body: z.object({
        table: z
            .number({message: "Number of table is required"})
            .int({message: "Number of table must be an integer"})
            .positive({message: "Number of table must be a positive integer"}),
        name: z.string().optional()
    })
});

export const addItemOrderSchema = z.object({
    body: z.object({
        orderId: z.string({message: "Order ID is required"}).min(1, {message: "Order ID cannot be empty"}),
        productId: z.string({message: "Product ID is required"}).min(1, {message: "Product ID cannot be empty"}),
        amount: z
            .number({message: "Amount is required"})
            .int({message: "Amount must be an integer"})
            .positive({message: "Amount must be a positive integer"})
    })
});

export const removeItemOrderSchema = z.object({
  query: z.object({
    itemId: z
      .string({ message: "Item ID is required" })
      .min(1, { message: "Item ID cannot be empty" }),
  }),
});

export const detailOrderSchema = z.object({
  query: z.object({
    orderId: z
        .string({ message: "Order ID is required" })
        .min(1, { message: "Order ID cannot be empty" }),
    }),
});

export const sendOrderSchema = z.object({
  body: z.object({
    orderId: z
        .string({ message: "Order ID is required" })
        .min(1, { message: "Order ID cannot be empty" }),
    }),
});

export const finishOrderSchema = z.object({
  body: z.object({
    orderId: z
        .string({ message: "Order ID is required" })
        .min(1, { message: "Order ID cannot be empty" }),
    }),
});

export const deleteOrderSchema = z.object({
  query: z.object({
    orderId: z
        .string({ message: "Order ID is required" })
        .min(1, { message: "Order ID cannot be empty" }),
    }),
});