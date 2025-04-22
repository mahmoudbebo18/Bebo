import { z } from "zod";

const loginSchema = z
    .object({
        email: z.string().min(1, { message: "Email address is required" }).email(),
        password: z.string().min(1, { message: "Password is Required" })
    })

type loginType = z.infer<typeof loginSchema>;

export { loginSchema, type loginType };