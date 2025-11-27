"use client";

import { Button } from "@/src/components/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

export default function Error() {
  const t = useTranslations("Error");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="text-2xl text-gray-500">{t("description")}</p>
      <Button
        onClick={() => router.push("/")}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {t("goBack")}
      </Button>
    </div>
  );
}
