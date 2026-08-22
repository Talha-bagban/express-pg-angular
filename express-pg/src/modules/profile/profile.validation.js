import {z} from 'zod';

export const editProfileSchema = z.object({
    firstname: z.string().trim().min(2,"Firstname must be at least 2 characters").max(50) , 
    lastname: z.string().trim().min(2,"Lastname must be at least 2 characters").max(50) , 
    email: z.string().trim().email("Invalid email"), 
    status: z.string()
})

export const changePassword = z.object({
    oldPassword: z.string().min(4, "oldPassword must be at least 4 characters").max(20),
    newPassword: z.string().min(4, "newPassword must be at least 4 characters").max(20),
    renewPassword: z.string().min(4, "renewPassword must be at least 4 characters")
}).refine((data) => data.newPassword === data.renewPassword, {
    message: "Password do not match",
    path: ["renewPassword"]
})