"use client";

import { useAuth } from "./layouts";
import { useRouter } from "next/navigation";
import type React from "react"; // Added import for React

type AllowedRoles = "CLIENT" | "SALES_MANAGER" | "CEO";

export function withRoleAccess(
  WrappedComponent: React.ComponentType,
  allowedRoles: AllowedRoles[],
) {
  return function WithRoleAccess(props: any) {
    const { user } = useAuth();
    const router = useRouter();

    if (!user || !allowedRoles.includes(user.role)) {
      router.push("/login");
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
