import z from "zod"

export const signupParams=z.object({
    username:z.string().max(12).min(3),
    email:z.string().email(),
    password:z.string().max(20).min(6)
})
export const loginParams=z.object({
    email:z.string().email(),
    password:z.string().max(20).min(6)
})

export const postParams=z.object({
    title:z.string().min(3),
    content:z.string().min(2)
})