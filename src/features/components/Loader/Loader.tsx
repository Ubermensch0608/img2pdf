export const Loader = () => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center gap-4 bg-black/50"
      aria-label="로딩 중"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      <div className="text-white text-2xl font-bold">변환 중...</div>
    </div>
  );
};
