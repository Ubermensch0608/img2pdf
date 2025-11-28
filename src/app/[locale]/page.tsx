import { FALLBACK_BASE_URL } from "@/src/constants";
import { Header } from "@/src/features/components/Header";
import { InnerContent } from "@/src/features/components/InnerContent";
import { AppLocale, routing } from "@/src/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Slide, ToastContainer } from "react-toastify";

//
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || FALLBACK_BASE_URL;

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "image to pdf",
      "pdf converter",
      "jpg to pdf",
      "png to pdf",
      "이미지 pdf 변환",
      "사진 pdf 변환",
      "무료 pdf 변환기",
    ],
    authors: [{ name: "img2pdf" }],
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}`,
      siteName: "img2pdf",
      locale: locale,
      type: "website",
      images: [
        {
          url: `${baseUrl}/api/og`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/api/og`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: routing.locales.reduce(
        (acc, loc) => {
          acc[loc] = `${baseUrl}/${loc}`;
          return acc;
        },
        {} as Record<string, string>,
      ),
    },
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
