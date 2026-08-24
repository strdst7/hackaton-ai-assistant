export function SkeletonCard({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border p-4 space-y-3 animate-pulse"
        >
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-5/6" />
          <div className="flex gap-2">
            <div className="h-6 bg-muted rounded w-16" />
            <div className="h-6 bg-muted rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}