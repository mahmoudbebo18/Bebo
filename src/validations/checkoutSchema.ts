import { z } from "zod";

export const addressSchema = z.object({
    city: z.string().min(1, "City is required"),
    district: z.string().min(1, "District is required"),
    street: z.string().min(1, "Street is required"),
    buildingNumber: z.string().min(1, "Building number is required"),
    notes: z.string().optional(),
});

export const checkoutSchema = z.object({
    phone_number: z.string().min(1, "Phone number is required"),

    // Address fields (optional when using saved address)
    city: z.string().optional(),
    district: z.string().optional(),
    street: z.string().optional(),
    buildingNumber: z.string().optional(),
    notes: z.string().optional(),
    
    // Options
    saveAddress: z.boolean().optional(),
    selectedAddressIndex: z.number().nullable().optional()
}).superRefine((data, ctx) => {
    // Custom validation - either selectedAddressIndex OR address fields must be provided
    if (data.selectedAddressIndex === null && (
        !data.city || !data.district || !data.street || !data.buildingNumber
    )) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Either select a saved address or enter a new address",
            path: ["city"] // This will highlight the first address field
        });
    }
});

export type Address = z.infer<typeof addressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;