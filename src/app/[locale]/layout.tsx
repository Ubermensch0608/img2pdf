import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "../sw-register";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FALLBACK_BASE_URL } from "@/src/constants";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || FALLBACK_BASE_URL;

export const metadata: Metadata = {
  title: "이미지 PDF 변환기 | 이미지 → PDF 무료 변환",
  description:
    "이미지를 JPG/PNG 파일로 업로드하여 PDF로 빠르게 변환하세요. 모든 작업은 로컬에서 처리되어 안전하고 빠릅니다.",
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
    title: "이미지 PDF 변환기 | 이미지 → PDF 무료 변환",
    description:
      "이미지를 JPG/PNG 파일로 업로드하여 PDF로 빠르게 변환하세요. 모든 작업은 로컬에서 처리되어 안전하고 빠릅니다.",
    url: `${baseUrl}`,
    siteName: "img2pdf",
  },
  twitter: {
    card: "summary_large_image",
    title: "이미지 PDF 변환기 | 이미지 → PDF 무료 변환",
    description:
      "이미지를 JPG/PNG 파일로 업로드하여 PDF로 빠르게 변환하세요. 모든 작업은 로컬에서 처리되어 안전하고 빠릅니다.",
    images: [`${baseUrl}/api/og`],
  },
  alternates: {
    canonical: `${baseUrl}`,
    languages: routing.locales.reduce(
      (acc, loc) => {
        acc[loc] = `${baseUrl}/${loc}`;
        return acc;
      },
      {} as Record<string, string>,
    ),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-128.png", sizes: "128x128", type: "image/png" },
      { url: "/icon-256.png", sizes: "256x256", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Localelayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || FALLBACK_BASE_URL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: locale === "ko" ? "이미지 PDF 변환기" : "Image to PDF Converter",
    description:
      locale === "ko"
        ? "이미지를 PDF로 무료로 변환하세요. 모든 작업은 로컬에서 처리되어 안전하고 빠릅니다."
        : "Convert your images to PDF for free. All operations are processed locally for safety and fast.",
    url: `${baseUrl}/${locale}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Image to PDF conversion",
      "JPG to PDF",
      "PNG to PDF",
      "Local processing",
      "Fast conversion",
      "Free tool",
    ],
  };

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <ServiceWorkerRegister />
          {children}
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
