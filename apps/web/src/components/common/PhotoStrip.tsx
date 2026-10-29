export function PhotoStrip({
  photos,
  alt,
  limit = 3,
}: {
  photos: readonly string[];
  alt: string;
  limit?: number;
}) {
  if (!photos.length) return null;
  return (
    <div className="grid grid-cols-3 gap-1.5 pt-1">
      {photos.slice(0, limit).map((url, index) => (
        <img
          key={`${url}-${index}`}
          src={url}
          alt={`${alt} ${index + 1}`}
          loading="lazy"
          className="h-14 w-full rounded-lg border border-slate-200 object-cover dark:border-white/10"
        />
      ))}
    </div>
  );
}
