import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../features/auth/authSlice";
import { ROLE } from "../constants/roles";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">
              <Link to="/" className="hover:text-gray-300">
                MathSlides
              </Link>
            </h1>
            <Link to="/" className="hover:text-gray-300">
              Trang Chủ
            </Link>
            {user?.roles.includes(ROLE.ADMIN) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-gray-700"
                  >
                    Quản Trị
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white text-gray-800 border border-gray-200 shadow-md rounded-md">
                  <DropdownMenuItem asChild>
                    <Link to="/school">Quản lý trường</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/grade">Quản lý khối lớp</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/chapter">Quản lý chương</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/lesson">Quản lý bài học</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/users">Quản lý người dùng</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {user?.roles.includes(ROLE.TEACHER) && (
              <Link to="/teaching-library" className="hover:text-gray-300">
                Giảng dạy
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <Link to="/profile" className="font-medium hover:text-gray-300">
                  Chào, {user.username}!
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm font-semibold"
                >
                  Đăng Xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md text-sm font-semibold"
                >
                  Đăng Nhập
                </Link>

                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-sm font-semibold"
                >
                  Đăng Ký
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow p-6 container mx-auto bg-gray-50">
        {children}
      </main>

      <footer className="bg-gray-200 p-4 text-center text-sm text-gray-600">
        © 2025 MathSlides Project
      </footer>
    </div>
  );
};

export default MainLayout;
