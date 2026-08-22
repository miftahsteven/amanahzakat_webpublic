export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <span className="text-xs font-bold text-text-muted">Memuat halaman AmanahZakat...</span>
    </div>
  );
}
