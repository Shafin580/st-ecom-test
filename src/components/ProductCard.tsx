import type { Product } from "../types/product";

export default function ProductCard({
  id,
  name,
  price,
  category,
  description,
  imageUrl,
}: Product) {
  return (
    <div
      className="w-full flex flex-col gap-3 group cursor-pointer"
      id={`product-${id}`}
    >
      {/* Image Container: Figma shows an image on a rounded, light-colored background */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] bg-[#EBEBEB]">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Hover Tooltip Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 pointer-events-none">
          <p className="text-white text-sm text-center line-clamp-6 drop-shadow-md">
            {description}
          </p>
        </div>
      </div>

      {/* Content Container: Left-aligned, no borders */}
      <div className="flex flex-col gap-1 px-1">
        {/* Brand / Category */}
        <p className="text-sm text-slate-500">
          {category}
        </p>

        {/* Title */}
        <h3 className="text-[16px] leading-[1.3] font-semibold text-slate-800 line-clamp-2">
          {name}
        </h3>

        {/* Price */}
        <div className="pt-1">
          <span className="text-[20px] font-bold text-[#2A75FF]">
            ৳ {price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
