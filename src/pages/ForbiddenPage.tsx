import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-800">
      <h1 className="text-6xl font-bold mb-4">403</h1>
      <p className="text-xl mb-6">Bạn không có quyền truy cập trang này</p>
      <Link
        to="/"
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Về Trang chủ
      </Link>
    </div>
  );
}
