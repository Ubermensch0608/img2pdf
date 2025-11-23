export const Header = () => {
  return (
    <header
      className="flex flex-col items-center justify-center"
      aria-label="헤더"
    >
      <h1 className="text-2xl font-bold">이미지 → PDF 변환기</h1>
      <p className="text-sm text-gray-500">
        이미지를 JPG/PNG 파일로 업로드하여 PDF로 빠르게 변환하세요. 모든 작업은
        로컬에서 처리되어 안전하고 빠릅니다.
      </p>
    </header>
  );
};
