import { ROLE } from "../constants/roles";
import type { AppRouteGroup } from "../types/common";

// ==== PAGES ====
import HomePage from "../features/homepage/Homepage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "@/features/register/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import ForbiddenPage from "../pages/ForbiddenPage";

import SlideEditorPage from "@/featurers/slideEditor/pages/SlideEditorPage";
import SchoolsPage from "@/features/school/SchoolsPage";
import GradesPage from "@/features/grade/GradesPage";
import LessonsPage from "@/features/lesson/LessonsPage";
import ChaptersPage from "@/features/chapter/ChaptersPage";
import LibraryPage from "@/features/teachingLibrary/LibraryPage";
import UsersPage from "@/features/user/UsersPage";
import PresentationPage from "@/featurers/presentation/pages/PresentationPage";
import UserProfile from "@/pages/UserProfile";

// ==== PUBLIC ROUTES ====
const publicRoutes: AppRouteGroup = {
  routes: [
    {
      path: "/",
      title: "Trang chủ",
      element: <HomePage />,
    },
    {
      path: "/login",
      title: "Đăng nhập",
      element: <LoginPage />,
    },
    {
      path: "/register",
      title: "Đăng ký",
      element: <RegisterPage />,
    },
    {
      path: "/present/:id",
      title: "Trình chiếu",
      element: <PresentationPage />,
    },
  ],
};

// ==== USER ROUTES ====
const userRoutes: AppRouteGroup = {
  allowedRoles: [ROLE.TEACHER, ROLE.ADMIN],
  routes: [
    {
      path: "/slide-editor/:id",
      title: "Trình chỉnh sửa slide",
      element: <SlideEditorPage />,
    },
    {
      path: "/teaching-library",
      title: "Thư viện giảng dạy",
      element: <LibraryPage />,
    },
    {
      path: "/profile",
      title: "Hồ sơ người dùng",
      element: <UserProfile />,
    }
  ],
};

// ==== ADMIN ROUTES ====
const adminRoutes: AppRouteGroup = {
  allowedRoles: [ROLE.ADMIN],
  routes: [
    {
      path: "/school",
      title: "Quản lý trường học",
      element: <SchoolsPage />,
    },
    {
      path: "/grade",
      title: "Quản lý khối lớp",
      element: <GradesPage />,
    },
    {
      path: "/chapter",
      title: "Quản lý chương",
      element: <ChaptersPage />,
    },
    {
      path: "/lesson",
      title: "Quản lý bài học",
      element: <LessonsPage />,
    },
    {
      path: "/slide-editor",
      title: "Trình chỉnh sửa slide",
      element: <SlideEditorPage />,
    },
        {
      path: "/users",
      title: "Quản lý người dùng",
      element: <UsersPage />,
    },
  ],
};

// ==== EXTRA ROUTES ====
const notFoundRoute = {
  path: "*",
  title: "Không tìm thấy trang",
  element: <NotFoundPage />,
};

const forbiddenRoute = {
  path: "/403-forbidden",
  title: "Không có quyền truy cập",
  element: <ForbiddenPage />,
};

// ==== EXPORT ====
export const appRoutes = [publicRoutes, userRoutes, adminRoutes];
export const extraRoutes = [notFoundRoute, forbiddenRoute];
