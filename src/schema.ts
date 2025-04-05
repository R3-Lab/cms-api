import { z } from 'zod';

// Schema for custom data
export const customDataSchema = z.object({
    key: z.string().min(1, { message: 'Key is required' }),
    value: z.string().min(1, { message: 'Value is required' })
});

// Schema for lead validation
export const leadSchema = z.object({
    firstName: z.string()
        .min(1, { message: 'First name is required' })
        .max(50, { message: 'First name must be less than 50 characters' }),

    lastName: z.string()
        .min(1, { message: 'Last name is required' })
        .max(50, { message: 'Last name must be less than 50 characters' }),

    email: z.string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Please enter a valid email address' }),

    phone: z.string()
        .optional()
        .refine(
            (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
            { message: 'Please enter a valid phone number' }
        ),

    company: z.string()
        .max(100, { message: 'Company name must be less than 100 characters' })
        .optional(),

    website: z.string()
        .url({ message: 'Please enter a valid URL' })
        .optional(),

    source: z.string()
        .max(100, { message: 'Source must be less than 100 characters' })
        .optional(),

    message: z.string()
        .max(500, { message: 'Message must be less than 500 characters' })
        .optional(),

    customData: z.array(customDataSchema)
        .optional(),
});

// Type inference from the schema
export type LeadSchemaType = z.infer<typeof leadSchema>;
