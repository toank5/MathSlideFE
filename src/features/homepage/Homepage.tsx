import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.png';
import { ROLE } from '@/constants/roles';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const CtaButton = () => {
    if (!isAuthenticated) {
      return (
        <Link
          to="/login"
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition duration-300"
        >
          Bắt Đầu Miễn Phí
        </Link>
      );
    }

    if (user?.roles.includes(ROLE.ADMIN)) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="px-8 py-3 bg-slate-800 text-white font-bold rounded-full hover:bg-slate-700 transition duration-300"
            >
              Quản Trị
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-white text-gray-800">
            <DropdownMenuItem asChild>
              <Link to="/schools">Quản lí trường</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/grades">Quản lí khối lớp</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/chapters">Quản lí chương</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/lessons">Quản lí bài học</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/users">Quản lí user</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    
    if (user?.roles.includes(ROLE.TEACHER)) {
        return (
            <Link
                to="/teaching-library"
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition duration-300"
            >
                Đến Thư Viện Giảng Dạy
            </Link>
        );
    }
    
    return null;
  };

  return (
    <div className="text-gray-800">
      <section className="text-center py-20 bg-white">
        <div className="container mx-auto">
            <img 
                src={logo} 
                alt="Bộ Giáo dục và Đào tạo" 
                className="h-20 w-auto mx-auto mb-6"
            />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Biến Ý Tưởng Toán Học
            <br />
            <span className="text-indigo-600">Thành Bài Giảng Sống Động</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Công cụ thiết kế slide chuyên biệt cho giáo dục, giúp bạn dễ dàng tạo ra các bài giảng toán học hấp dẫn và chuyên nghiệp chỉ trong vài phút.
          </p>
          <div className="mt-8">
            <CtaButton />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2">Tại sao chọn MathSlides?</h2>
          <p className="text-gray-600 mb-12">Những công cụ mạnh mẽ được thiết kế dành riêng cho giáo viên.</p>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🧮</div>
              <h3 className="text-xl font-semibold mb-2">Thư viện Công thức</h3>
              <p className="text-gray-600">
                Tích hợp sẵn bộ gõ LaTeX và hàng trăm ký hiệu toán học, từ cơ bản đến nâng cao.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Mẫu Slide Chuyên nghiệp</h3>
              <p className="text-gray-600">
                Các mẫu được thiết kế sẵn cho nhiều chủ đề: Đại số, Hình học, Giải tích... Giúp bạn tiết kiệm thời gian.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Vẽ Đồ thị & Sơ đồ</h3>
              <p className="text-gray-600">
                Dễ dàng vẽ các hàm số, hình học không gian và các sơ đồ tư duy phức tạp một cách trực quan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-indigo-700 text-white text-center py-16">
          <div className="container mx-auto">
              <h2 className="text-3xl font-bold mb-4">Sẵn sàng nâng tầm bài giảng của bạn?</h2>
              <p className="max-w-2xl mx-auto mb-8">
                  Tham gia cùng hàng ngàn giáo viên khác và bắt đầu tạo ra những nội dung giáo dục chất lượng cao ngay hôm nay.
              </p>
              <div className="mt-8">
                <CtaButton />
              </div>
          </div>
      </section>
    </div>
  );
};

export default HomePage;