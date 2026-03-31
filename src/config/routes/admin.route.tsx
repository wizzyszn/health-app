import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const LoginAdmin = lazy(() => import("@/auth/admin/login.admin.auth"));
const RegisterAdmin = lazy(() => import("@/auth/admin/register.admin.auth"));

const admin_routes: RouteObject[] = [
  {
    path: "login",
    element: <LoginAdmin />,
  },
  {
    path: "sign-up",
    element: <RegisterAdmin />,
  },
];

export default admin_routes;
