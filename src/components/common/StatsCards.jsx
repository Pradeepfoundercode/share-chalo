import React from "react";

/**
 * StatsCards - Reusable metric stats cards for Drivers, Passengers, and other pages
 *
 * Props:
 * @param {Array} items - List of card items
 *   Each item supports:
 *   - id: string|number
 *   - label: string (e.g. "Total Drivers", "Total Passengers")
 *   - value: string|number (e.g. "1,250", "12,480")
 *   - icon: Lucide icon component (e.g. CheckCircle2) or JSX
 *   - image: Image src url string (e.g. svg or png)
 *   - cardColor: Background and border classes (e.g. "bg-[#fffbeb] border-amber-200/80")
 *   - iconBg: Icon container background (e.g. "bg-amber-200/80")
 *   - iconColor: Icon container text color (e.g. "text-emerald-600")
 *   - iconBoxSize: Custom icon wrapper size (default: "w-12 h-12 rounded-xl")
 *   - iconSize: Custom icon image/SVG size (default: "w-full h-full p-2.5" or "w-6 h-6 stroke-[2.4]")
 *   - height: Custom card height / padding (e.g. "h-20" or "p-3 sm:p-3.5")
 *   - width: Custom card width (e.g. "w-full" or "w-64")
 *   - labelClassName: Custom label font classes
 *   - valueClassName: Custom value font classes
 *   - onClick: Optional click handler
 * @param {string} [columns] - Grid columns class (default: "lg:grid-cols-6" or adapts by items length)
 * @param {string} [cardHeight] - Global height/padding for all cards
 * @param {string} [cardWidth] - Global width for all cards
 * @param {string} [className] - Additional wrapper grid classes
 */
const StatsCards = ({
  items = [],
  columns,
  cardHeight = "",
  cardWidth = "",
  className = "",
}) => {
  // Auto grid columns if not passed
  const gridLayout =
    columns ||
    (items.length === 6
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
      : items.length === 5
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
      : items.length === 4
      ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
      : items.length === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6");

  return (
    <div className={`grid gap-2.5 sm:gap-3 ${gridLayout} ${className}`}>
      {items.map((item, index) => {
        const Icon = item.icon;

        const effectiveHeight = item.height || cardHeight;
        const effectiveWidth = item.width || cardWidth;
        const effectiveIconBoxSize =
          item.iconBoxSize || "w-12 h-12 rounded-xl";

        return (
          <div
            key={item.id ?? index}
            onClick={item.onClick}
            className={`min-w-0 rounded-2xl p-2.5 sm:p-3 border shadow-2xs flex items-center gap-2.5 transition-all ${
              item.cardColor || "bg-white border-gray-200"
            } ${effectiveHeight} ${effectiveWidth} ${
              item.onClick
                ? "cursor-pointer hover:shadow-xs active:scale-[0.99]"
                : ""
            }`}
          >
            {/* Icon Box */}
            <div
              className={`flex items-center justify-center shrink-0 shadow-2xs ${effectiveIconBoxSize} ${
                item.iconBg || "bg-gray-100"
              } ${item.iconColor || "text-slate-700"}`}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.label || "Stat"}
                  className={`object-contain ${
                    item.iconSize || "w-full h-full p-2.5"
                  }`}
                />
              ) : React.isValidElement(Icon) ? (
                Icon
              ) : Icon ? (
                <Icon
                  className={`${item.iconSize || "w-6 h-6 stroke-[2.4]"}`}
                />
              ) : null}
            </div>

            {/* Content Text */}
            <div className="min-w-0">
              <p
                className={`text-[11px] font-semibold mt-0.5 truncate ${
                  item.labelClassName || "text-slate-600"
                }`}
              >
                {item.label}
              </p>

              <h3
                className={`text-lg sm:text-xl font-bold text-slate-900 leading-tight ${
                  item.valueClassName || ""
                }`}
              >
                {item.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
