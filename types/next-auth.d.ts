import NextAuth, { DefaultSession } from "next-auth"
import { DefaultJWT } from "@auth/core/jwt";

declare module "next-auth" {
    /**
     * Extending the built-in session types
     */
    interface Session {
        user: {
            id: string;
            canvasId?: string;
            canvasName?: string;
            canvasEmail?: string;
        } & DefaultSession['user'];
    }
}

declare module '@auth/core/jwt' {
    interface JWT {
        id: string
    }
}

