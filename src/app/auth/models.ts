import { z } from "zod";

export const signPayloadModel = z.object({
    firstName: z.string().min(2).max(45),
    lastName: z.string().max(45).nullable().optional(),
    email: z.string().trim().max(233).toLowerCase().pipe(z.email()),
    password: z.string().min(6).max(128),
});

export const signInPayloadModel = z.object({
    email: z.string().trim().toLowerCase().pipe(z.email()),
    password: z.string().min(6)
});