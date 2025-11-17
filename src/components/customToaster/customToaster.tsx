"use client";

import { Toaster } from "react-hot-toast";

export default function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#000",
          color: "#fff",
          borderRadius: "14px",
          padding: "10px 20px",
          boxShadow: "0 6px 25px rgba(0,0,0,0.4)",
          fontSize: "15px",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(6px)",
        },
        success: {
          iconTheme: {
            primary: "#22c55e", 
            secondary: "#111827",
          },
        },
        error: {
          iconTheme: {
            primary: "#f43f5e", 
            secondary: "#111827",
          },
        },
      }}
    />
  );
}
