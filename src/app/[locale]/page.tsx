import { Header } from "@/src/features/components/Header";
import { InnerContent } from "@/src/features/components/InnerContent";
import { AppLocale, routing } from "@/src/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Slide, ToastContainer } from "react-toastify";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

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

  setRequestLocale(locale);

  return (
    <main className="flex flex-col items-center justify-center p-4 gap-4">
      <Header />
      <InnerContent />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        closeButton={false}
        hideProgressBar
        transition={Slide}
        rtl={locale === "ar"}
      />
    </main>
  );
}
