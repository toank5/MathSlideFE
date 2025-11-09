import { ROLE } from "../constants/roles";

export type AppRoute = {
  path: string;
  title: string;
  element: React.ReactNode;
};

export interface AppRouteGroup {
  allowedRoles?: ROLE[];
  routes: AppRoute[];
}
