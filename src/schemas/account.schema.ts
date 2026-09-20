import { z } from "zod";

/**
 * Schema for updating admin email address.
 * Requires verification of current password.
 */
export const ChangeEmailSchema = z.object({
    newEmail: z
        .string()
        .trim()
        .min(1, "New email address is required")
        .email("Please enter a valid email address")
        .toLowerCase(),
    currentPassword: z
        .string()
        .min(1, "Current password is required to verify your identity"),
});

export type ChangeEmailInput = z.infer<typeof ChangeEmailSchema>;

/**
 * Schema for updating admin password.
 * Requires current password and confirmed new password.
 */
export const ChangePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters long")
            .regex(/[A-Za-z]/, "Password must contain at least one letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        confirmPassword: z
            .string()
            .min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New passwords do not match",
        path: ["confirmPassword"],
    });

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
