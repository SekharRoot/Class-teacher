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
          position: "relative",
          width: "48px",
          height: "48px",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            border: "3px solid rgba(59, 130, 246, 0.1)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            border: "3px solid transparent",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin-smooth 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
        />
      </div>
      <style>
        {`
          @keyframes spin-smooth { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes pulse-text { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.98); } }
        `}
      </style>
      <div
        style={{
          marginTop: "20px",
          color: "#4b5563",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 600,
          fontSize: "15px",
          animation: "pulse-text 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        }}
      >
        Starting School Management System...
      </div>
    </div>
  );
};
