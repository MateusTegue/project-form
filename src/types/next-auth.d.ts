import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      id: string;
      identifier: string;
      name: string;
      token?: string;
      role: string;
    };
  }

  interface User {
    token: string;
    user: {
      id: string;
      identifier: string;
      name: string;
      token?: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: {
      id: string;
      identifier: string;
      name: string;
      token?: string;
      role: string;
    };
  }
}

export default NextAuth;