export function SkeletonTree() {
  const rows = [
    { indent: 0, width: "w-40" },
    { indent: 1, width: "w-56" },
    { indent: 1, width: "w-48" },
    { indent: 2, width: "w-64" },
    { indent: 2, width: "w-60" },
    { indent: 1, width: "w-52" },
    { indent: 2, width: "w-72" },
    { indent: 0, width: "w-36" },
  ];

  return (
    <div className="rounded-lg border border-border p-4 space-y-2 animate-pulse">
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex items-center gap-2"
          style={{ paddingLeft: `${row.indent * 16}px` }}
        >
          <div className="h-3 w-3 rounded bg-muted shrink-0" />
          <div className={`h-3 bg-muted rounded ${row.width}`} />
        </div>
      ))}
    </div>
  );
}