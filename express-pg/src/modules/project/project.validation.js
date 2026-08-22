import { z } from "zod";

export const taskSchema = z.object({
    title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title cannot exceed 50 characters"),

     description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(200, "Description cannot exceed 200 characters"),

     start_date: z
    .string()
    .date("Invalid start date"),

     end_date: z
    .string()
    .date("Invalid end date")
    .refine(
        (data) => new Date(data.end_date) >= new Date(data.start_date),
        {
            message: "End date must be after start date",
            path: ["end_date"],
        }
    )


    
})
