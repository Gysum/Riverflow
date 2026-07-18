import { z } from "zod";

export const questionSchema = z.object({
    title: z
        .string()
        .min(15, "Title must be at least 15 characters.")
        .max(150, "Title cannot exceed 150 characters."),

    content: z
        .string()
        .min(30, "Description must be at least 30 characters."),

    tags: z
        .array(z.string())
        .min(1, "Please add at least one tag.")
        .max(5, "You can add up to 5 tags only."),

    image: z
        .instanceof(File)
        .optional()
        .nullable(),
});

export type QuestionFormData = z.infer<typeof questionSchema>;