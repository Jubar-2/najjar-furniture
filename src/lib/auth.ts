import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "../db/dbConnect";
import UserModel from "@/models/user.model";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {

                await dbConnect();

                if (!credentials?.email || !credentials?.password) return null;

                try {

                    const user = await UserModel.findOne({
                        email: credentials.email.toLowerCase()
                    }).exec();

                    if (!user || !user.password) return null;

                    if (!(await bcrypt.compare(credentials.password as string, user.password))) {
                        return null;
                    }

                    return {
                        id: user._id,
                        _id: user._id,
                        email: user.email,
                    };


                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    }
                    throw new Error("An unknown error occurred during login");
                }
            },
        }),

    ],

    callbacks: {

        async jwt({ token, user }) {
            if (user) {
                token._id = user._id;
                token.email = user.email;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.email = token.email;
            }
            return session;
        },
    },

    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60,
    },

    pages: {
        signIn: "/control-panel/auth",
    },

    secret: process.env.NEXTAUTH_SECRET,
};