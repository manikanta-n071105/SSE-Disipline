"use client";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface RequireRoleGenderProps {
  children: ReactNode;
  allowedRoles: ("ADMIN" | "STUDENT" | "WARDEN"|"WATCHMAN"|"SUPER")[];
  allowedGenders?: ("MALE" | "FEMALE")[];
}

export default function RequireRoleGender({
  children,
  allowedRoles,
  allowedGenders,
}: RequireRoleGenderProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !loading &&
      (!user ||
        !allowedRoles.includes(user.role) ||
        (allowedGenders && user.gender && !allowedGenders.includes(user.gender)))
    ) {
      router.push("/unauthorized");
    }
  }, [user, loading, router, allowedRoles, allowedGenders]);

  if (loading || !user) return <p>Loading...</p>;

  return <>{children}</>;
}
