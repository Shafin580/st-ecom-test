export default function ProductSkeleton() {
  return (
    <div className="w-full flex flex-col gap-3 animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/5] w-full rounded-[16px] bg-slate-200" />

      {/* Text placeholders */}
      <div className="flex flex-col gap-2 px-1">
        <div className="h-3 w-16 rounded bg-slate-200" />
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-200" />
        <div className="h-5 w-24 rounded bg-slate-200 mt-1" />
      </div>
    </div>
  );
}
