import {z} from 'zod';

export const managerSchema = z.object({
    firstname: z.string().trim().min(2,"Firstname must be at least 2 characters").max(50) , 
    lastname: z.string().trim().min(2,"Lastname must be at least 2 characters").max(50) , 
    email: z.string().trim().email("Invalid email"),
    password: z.string().min(4, "Password must be at least 4 characters").max(20),
    department_id: z.string().uuid("Invalid department ID"), 
})

export const employeeSchema = z.object({
    firstname: z.string().trim().min(2,"Firstname must be at least 2 characters").max(50) , 
    lastname: z.string().trim().min(2,"Lastname must be at least 2 characters").max(50) , 
    email: z.string().trim().email("Invalid email"),
    password: z.string().min(4, "Password must be at least 4 characters").max(20),
    department_id: z.string().uuid("Invalid department ID"), 
})