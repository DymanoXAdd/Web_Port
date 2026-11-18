import { z } from "zod";

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  subject: z
    .string()
    .trim()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters")
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// Minecraft Java usernames: 3-16 letters, digits or underscore. The server script re-checks this
// before it puts a name into an RCON command.
export const MC_USERNAME = /^[A-Za-z0-9_]{3,16}$/;

export const whitelistRequestSchema = z.object({
  username: z
    .string()
    .trim()
    .regex(MC_USERNAME, "Enter your Minecraft Java username (3-16 letters, numbers or _)"),
  note: z.string().trim().max(200, "Keep the note under 200 characters").optional(),
});

export type WhitelistRequestInput = z.infer<typeof whitelistRequestSchema>;
