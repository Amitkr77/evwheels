"use client";

// Shared "colored circle/square + first initial" avatar — replaces four
// independent copies of the same pattern across profile/page.jsx and Settings.jsx.
// `size` picks the existing visual treatment each call site already used.
const VARIANTS = {
  sm: "w-8 h-8 text-sm rounded-full",
  md: "w-10 h-10 text-base rounded-full",
  lg: "w-24 h-24 md:w-32 md:h-32 text-4xl rounded-2xl",
};

export default function UserAvatar({ name, size = "md", className = "" }) {
  const initial = name?.charAt(0)?.toUpperCase() || "U";
  return (
    <div
      className={`shrink-0 bg-[#19B5D8] flex items-center justify-center text-white font-medium shadow-sm ${VARIANTS[size]} ${className}`}
    >
      {initial}
    </div>
  );
}
