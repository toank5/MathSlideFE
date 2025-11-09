// src/components/ToastProvider.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";

interface Toast {
  id: number;
  message: string;
  description?: string;
  type?: "success" | "error" | "info";
}

interface ToastContextProps {
  showToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextProps | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...toast }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-[9999] space-y-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`px-4 py-3 rounded-lg shadow-md text-white transition-opacity duration-300 ${
                t.type === "success"
                  ? "bg-green-500"
                  : t.type === "error"
                  ? "bg-red-500"
                  : "bg-gray-800"
              }`}
            >
              <div className="font-semibold">{t.message}</div>
              {t.description && <div className="text-sm opacity-90">{t.description}</div>}
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
