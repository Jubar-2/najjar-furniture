import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import bcrypt from "bcrypt";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/db/dbConnect";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/lib/apiResponse";
import { ChangeEmailSchema, ChangePasswordSchema } from "@/schemas/account.schema";

/**
 * GET /api/control-panel/account
 * Returns currently authenticated admin's public profile data (email, dates).
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return ApiResponse.error("Unauthorized", 401);
        }

        await dbConnect();

        const user = await UserModel.findOne({
            $or: [
                ...(session.user._id ? [{ _id: session.user._id }] : []),
                ...(session.user.email ? [{ email: session.user.email.toLowerCase() }] : []),
            ],
        })
            .select("-password")
            .exec();

        if (!user) {
            return ApiResponse.error("Account not found", 404);
        }

        return ApiResponse.success(
            {
                id: user._id,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            "Account profile retrieved"
        );
    } catch (error) {
        console.error("GET /api/control-panel/account error:", error);
        return ApiResponse.fatal("Failed to load account profile.");
    }
}

/**
 * PUT /api/control-panel/account
 * Updates admin email or password upon verification of current password.
 */
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return ApiResponse.error("Unauthorized. Please log in first.", 401);
        }

        const body = await req.json();
        const { action } = body;

        await dbConnect();

        // Find current authenticated user with password
        const user = await UserModel.findOne({
            $or: [
                ...(session.user._id ? [{ _id: session.user._id }] : []),
                ...(session.user.email ? [{ email: session.user.email.toLowerCase() }] : []),
            ],
        }).exec();

        if (!user || !user.password) {
            return ApiResponse.error("Account not found or password not set.", 404);
        }

        // Action: Change Email
        if (action === "change-email") {
            const parsed = ChangeEmailSchema.safeParse(body);
            if (!parsed.success) {
                return ApiResponse.error(
                    "Validation failed",
                    422,
                    z.treeifyError(parsed.error)
                );
            }

            const { newEmail, currentPassword } = parsed.data;

            // Verify current password
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return ApiResponse.error("Current password is incorrect.", 400);
            }

            if (user.email.toLowerCase() === newEmail.toLowerCase()) {
                return ApiResponse.error("New email is the same as your current email.", 400);
            }

            // Check uniqueness against other users
            const existingUser = await UserModel.findOne({
                email: newEmail.toLowerCase(),
                _id: { $ne: user._id },
            }).exec();

            if (existingUser) {
                return ApiResponse.error("This email address is already in use by another account.", 409);
            }

            user.email = newEmail.toLowerCase().trim();
            await user.save();

            return ApiResponse.success(
                { email: user.email },
                "Email address updated successfully."
            );
        }

        // Action: Change Password
        if (action === "change-password") {
            const parsed = ChangePasswordSchema.safeParse(body);
            if (!parsed.success) {
                return ApiResponse.error(
                    "Validation failed",
                    422,
                    z.treeifyError(parsed.error)
                );
            }

            const { currentPassword, newPassword } = parsed.data;

            // Verify current password
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return ApiResponse.error("Current password is incorrect.", 400);
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            user.password = hashedPassword;
            await user.save();

            return ApiResponse.success(
                null,
                "Password updated successfully."
            );
        }

        return ApiResponse.error("Invalid action requested. Expected 'change-email' or 'change-password'.", 400);
    } catch (error) {
        console.error("PUT /api/control-panel/account error:", error);
        return ApiResponse.fatal("Failed to update account credentials.");
    }
}
