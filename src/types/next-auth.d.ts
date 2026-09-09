import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        accessToken?: string
        error?: string
        user: {
            _id: string
            email: string
        } & DefaultSession["user"]
    }

    interface User {
        _id: string,
        email: string,
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string;
        email: string;
        accessToken: string;
        refreshToken: string;
        accessTokenExpires: number;
        error?: string
    }
}