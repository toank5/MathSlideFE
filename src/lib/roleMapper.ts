import { ROLE } from "@/constants/roles";

export const mapRoles = (roles: string[]): number[] => {
  if (!Array.isArray(roles)) return [];
  return roles.map((r) => {
    if (r === "Admin") return ROLE.ADMIN;
    if (r === "Teacher") return ROLE.TEACHER;
    return ROLE.TEACHER;
  });
};
