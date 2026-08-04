"use client";

// Shared on/off switch — replaces the icon-button (ToggleLeft/ToggleRight)
// pattern used in Categories/Segments/Products, which rendered a visual
// toggle with no ARIA switch semantics at all. Subcategories/Coupons already
// had the correct role="switch" sliding-pill markup; this brings the rest
// of the admin up to that same standard instead of the other way around.

const SIZES = {
  sm: { track: "h-6 w-11", thumb: "h-4 w-4" },
  md: { track: "h-7 w-12", thumb: "h-5 w-5" },
};

export default function StatusToggle({
  checked,
  onClick,
  ariaLabel,
  title,
  size = "sm",
  showLabel = true,
  labelOn = "Active",
  labelOff = "Inactive",
  className = "",
}) {
  const { track, thumb } = SIZES[size] || SIZES.sm;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
      className={`flex items-center gap-2 cursor-pointer group ${className}`}
    >
      <span
        className={`relative inline-flex ${track} items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#19B5D8] focus:ring-offset-2 ${
          checked ? "bg-[#19B5D8]" : "bg-neutral-300"
        }`}
      >
        <span
          className={`inline-block ${thumb} transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
      {showLabel && (
        <span
          className={`text-xs font-medium transition-colors ${
            checked
              ? "text-[#19B5D8] group-hover:text-[#19B5D8]"
              : "text-neutral-500 group-hover:text-neutral-600"
          }`}
        >
          {checked ? labelOn : labelOff}
        </span>
      )}
    </button>
  );
}
