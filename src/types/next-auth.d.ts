declare module "next-auth" {
  export interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      avatar?: string;
      level?: number;
      xp?: number;
    };
  }

  export interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    avatar?: string;
    level?: number;
    xp?: number;
  }

  export interface NextAuthOptions {
    providers: any[];
    session?: any;
    callbacks?: any;
    pages?: any;
    secret?: string;
  }

  export default function NextAuth(options: NextAuthOptions): any;
  export default function NextAuth(...args: any[]): any;
}

declare module "next-auth/react" {
  export function useSession(): { data: any; status: "authenticated" | "unauthenticated" | "loading" };
  export function signIn(...args: any[]): Promise<any>;
  export function signOut(...args: any[]): Promise<any>;
  export function SessionProvider(props: any): any;
}

declare module "next-auth/providers/credentials" {
  export default function CredentialsProvider(options: any): any;
}

declare module "next-auth/jwt" {
  export interface JWT {
    id?: string;
    role?: string;
    avatar?: string;
    level?: number;
    xp?: number;
  }
}
