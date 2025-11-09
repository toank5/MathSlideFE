import { App as AntApp } from 'antd';
import { Routes, Route } from "react-router-dom";
import { appRoutes, extraRoutes } from "./routes";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import { useAppDispatch } from "./store/hooks";
import { useEffect } from "react";
import { fetchCurrentUser } from "./features/auth/authSlice";
import { useAuth } from "./hooks/useAuth";
import '@ant-design/v5-patch-for-react-19';

function App() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAuth();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium">
        Đang tải...
      </div>
    );
  }

  return (
    <AntApp>
      <MainLayout>
        <Routes>
          {appRoutes[0].routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {appRoutes.slice(1).map((group, index) => (
            <Route
              key={index}
              element={<ProtectedRoute allowedRoles={group.allowedRoles || []} />}
            >
              {group.routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
          ))}

          {extraRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </MainLayout>
    </AntApp>
  );
}

export default App;
