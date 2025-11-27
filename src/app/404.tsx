"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="text-2xl text-gray-500">{t("description")}</p>
      <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded-md">
        {t("goBack")}
      </Link>
    </div>
  );
}
