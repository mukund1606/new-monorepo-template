import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  name: z.string(),
  image: z.string().nullish(),
});

export type User = z.infer<typeof userSchema>;
