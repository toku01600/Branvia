import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const { handlers: { GET, POST }, auth } = NextAuth(authOptions);