"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      dir="rtl"
      position="top-center"
      toastOptions={{
        style: {
          background: "#2f020d",
          color: "#ffffff",
          border: "1px solid rgba(254, 214, 91, 0.35)",
          borderRadius: "16px",
          boxShadow: "0 16px 40px rgba(47, 2, 13, 0.28)",
          fontFamily: "'IBM Plex Sans Arabic', 'Plus Jakarta Sans', sans-serif",
        },
        classNames: {
          title: "!text-white font-bold text-sm",
          description: "!text-[#ffd9dd] text-xs mt-0.5",
          actionButton:
            "!bg-[#fed65b] !text-[#241a00] font-semibold rounded-full",
          cancelButton:
            "!bg-[#4a1521] !text-white rounded-full",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
