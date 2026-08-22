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

    priority: z.enum(
        ["low", "medium", "high"],
        {
        error: "Priority must be Low, Medium or High",
        }
    ),

    assigned_to: z
    .string()
    .uuid("Invalid employee"),

     project: z
    .string()
    .uuid("Invalid project"),

    due_date: z
    .string()

});
