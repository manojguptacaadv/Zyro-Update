import React from "react";

interface ZyroLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textClassName?: string;
  variant?: "solid" | "glass" | "dark";
  className?: string;
}

export const ZyroLogo: React.FC<ZyroLogoProps> = ({
  size = "md",
  showText = false,
  textClassName = "text-white text-base",
  variant = "solid",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-xl",
    md: "w-10 h-10 rounded-2xl",
    lg: "w-12 h-12 rounded-2xl",
    xl: "w-16 h-16 rounded-3xl",
  };

  const containerStyles = {
    solid: "bg-gradient-to-tr from-[#00B074] via-emerald-400 to-teal-300 shadow-lg shadow-emerald-500/20 text-slate-950",
    glass: "bg-white/15 backdrop-blur-md border border-white/30 text-white shadow-xl",
    dark: "bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/40 text-emerald-400 shadow-md",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Zyro Modern Mobility Monogram Badge */}
      <div
        className={`${sizeClasses[size]} ${containerStyles[variant]} flex items-center justify-center p-1.5 shrink-0 select-none relative overflow-hidden group`}
      >
        {/* Ambient glow highlight */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Dynamic Z Motion Path */}
          <path
            d="M10 13 H34 L12 31 H34"
            stroke={variant === "glass" ? "#FFFFFF" : variant === "solid" ? "#032219" : "#34D399"}
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Fast Forward Accent Slash */}
          <path
            d="M20 18 L26 26"
            stroke={variant === "glass" ? "#34D399" : variant === "solid" ? "#F59E0B" : "#FBBF24"}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Electric Mobility Bolt */}
          <path
            d="M24 8 L18 19 H24 L19 28 L28 17 H22 L25 8 Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="0.8"
            className="filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
          />
        </svg>
      </div>

      {showText && (
        <div className="leading-tight">
          <span className={`font-black tracking-tight ${textClassName}`}>
            Zy<span className="text-[#00B074]">ro</span>
          </span>
        </div>
      )}
    </div>
  );
};
