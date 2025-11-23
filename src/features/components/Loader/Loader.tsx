import { useTranslations } from "next-intl";

export const Loader = () => {
  const t = useTranslations("Loader");

  return (
    <div
      className="fixed inset-0 flex items-center justify-center gap-4 bg-black/50"
      aria-label={t("aria-label")}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      <div className="text-white text-2xl font-bold">
        {t("loadingDescription")}
      </div>
    </div>
  );
};
