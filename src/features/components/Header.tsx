import { useTranslations } from "next-intl";

export const Header = () => {
  const t = useTranslations("HomePage.header");

  return (
    <header
      className="flex flex-col items-center justify-center"
      aria-label={t("aria-label")}
    >
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="text-sm text-gray-500">{t("description")}</p>
    </header>
  );
};
