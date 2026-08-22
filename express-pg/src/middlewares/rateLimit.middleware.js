import {rateLimit} from 'express-rate-limit';
import { success } from 'zod';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message : {
        success: false,
        message : 'Too many requests. Please try again.'
    }
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        success: false, 
        message: 'Too many requests. Please try again.'
    }
})
