// lib/auth.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export const getSession = async () => {
  return await getServerSession(authOptions);
};
