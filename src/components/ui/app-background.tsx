import React from "react";

export function AppBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#070707]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 50% 70% at 50% 100%, rgba(244, 105, 5, 0.6) 0%, transparent 100%),
            radial-gradient(ellipse 50% 70% at 50% 100%, rgba(218, 134, 44, 0.4) 0%, transparent 100%),
            radial-gradient(ellipse 50% 70% at 50% 100%, rgba(227, 124, 40, 0.4) 0%, transparent 100%)
          `,
        }}
      />
    </div>
  );
}
