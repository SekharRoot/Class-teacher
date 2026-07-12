import React from "react";

export const LoadingOverlay: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid #e5e7eb",
          borderTopColor: "#3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
      <div
        style={{
          marginTop: "16px",
          color: "#6b7280",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 500,
        }}
      >
        Starting School Management System...
      </div>
    </div>
  );
};
