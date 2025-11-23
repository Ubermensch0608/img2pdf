import { Header } from "@/src/features/components/Header";
import { InnerContent } from "@/src/features/components/InnerContent";
import { AppLocale } from "@/src/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Home({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = use(params);

  // 이 페이지도 static rendering 사용 가능하게
  setRequestLocale(locale);

  return (
    <main className="flex flex-col items-center justify-center p-4 gap-4">
      <Header />
      <InnerContent />
    </main>
  );
}
