import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [
    // 기본 (8)
    "en", // English
    "ko", // Korean
    "ja", // Japanese
    "zh-CN", // Chinese (Simplified)
    "zh-TW", // Chinese (Traditional)
    "es", // Spanish
    "fr", // French
    "de", // German

    // 아시아 & 신흥시장 (5)
    "vi", // Vietnamese
    "th", // Thai
    "id", // Indonesian
    "ms", // Malay
    "hi", // Hindi

    // 중동/유럽 확장 (4)
    "pt-BR", // Portuguese (Brazil)
    "ru", // Russian
    "ar", // Arabic
    "tr", // Turkish
  ] as const,
  defaultLocale: "en" as const,
});

export type AppLocale = (typeof routing.locales)[number];
