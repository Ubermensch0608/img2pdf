import fs from "fs";
import path from "path";

const BASE_LOCALE = "en";
const LOCALES = [
  "ko",
  "ja",
  "zh-CN",
  "zh-TW",
  "es",
  "fr",
  "de",
  "vi",
  "th",
  "id",
  "ms",
  "hi",
  "pt-BR",
  "ru",
  "ar",
  "tr",
];

const LOCALES_DIR = path.join(process.cwd(), "locales");

function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ JSON parse error in: ${filePath}`);
    throw error;
  }
}

/**
 * 중첩 객체의 키를 "dot.notation" 형태로 평탄화
 * 예: { HomePage: { header: { title: "" } } }
 *  -> ["HomePage.header.title"]
 */

function flattenKeys(obj, prefix = "") {
  if (obj === null || obj === undefined) return [];

  const keys = [];

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

/**
 * 기준 로케일의 namespace 목록 얻기
 * (예: locales/en/common.json, locales/en/HomePage.json ...)
 */

function getNamespacesForLocale() {
  const localeDir = path.join(LOCALES_DIR);

  if (!fs.existsSync(localeDir)) {
    console.error(`❌ Locale directory not found: ${localeDir}`);
    return [];
  }

  return fs
    .readdirSync(localeDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.basename(file, ".json"));
}

/**
 * 메인 비교 로직
 */
function checkLocales() {
  let hasError = false;

  const baseNamespaces = getNamespacesForLocale(BASE_LOCALE);

  if (baseNamespaces.length === 0) {
    console.error(`❌ No namespaces found for base locale "${BASE_LOCALE}"`);
    process.exit(1);
  }

  console.log(`🔍 Base locale: ${BASE_LOCALE}`);
  console.log(`🔍 Namespaces: ${baseNamespaces.join(", ")}`);
  console.log("---");

  for (const locale of LOCALES) {
    if (locale === BASE_LOCALE) continue;

    console.log(`🌐 Checking locale: ${locale}`);

    const localeNamespaces = getNamespacesForLocale(locale);

    // 기준 로케일에는 있는데 해당 로케일에는 없는 namespace
    const missingNamespaces = baseNamespaces.filter(
      (ns) => !localeNamespaces.includes(ns),
    );
    if (missingNamespaces.length > 0) {
      hasError = true;
      console.error(
        `  ❌ Missing namespaces in "${locale}": ${missingNamespaces.join(", ")}`,
      );
    }

    // 반대로, 해당 로케일에만 있는 namespace (경고 정도로만)
    const extraNamespaces = localeNamespaces.filter(
      (ns) => !baseNamespaces.includes(ns),
    );
    if (extraNamespaces.length > 0) {
      console.warn(
        `  ⚠️ Extra namespaces only in "${locale}": ${extraNamespaces.join(
          ", ",
        )}`,
      );
    }

    // 각 namespace마다 키 비교
    for (const ns of baseNamespaces) {
      const basePath = path.join(LOCALES_DIR, BASE_LOCALE, `${ns}.json`);
      const targetPath = path.join(LOCALES_DIR, locale, `${ns}.json`);

      const baseJson = readJsonFile(basePath);
      const targetJson = readJsonFile(targetPath);

      if (!targetJson) {
        // 위에서 missingNamespaces로 이미 잡히긴 함
        continue;
      }

      const baseKeys = new Set(flattenKeys(baseJson));
      const targetKeys = new Set(flattenKeys(targetJson));

      const missingKeys = [];
      const extraKeys = [];

      for (const key of baseKeys) {
        if (!targetKeys.has(key)) {
          missingKeys.push(key);
        }
      }

      for (const key of targetKeys) {
        if (!baseKeys.has(key)) {
          extraKeys.push(key);
        }
      }

      if (missingKeys.length > 0) {
        hasError = true;
        console.error(
          `  ❌ [${locale}/${ns}.json] Missing keys (${missingKeys.length}):`,
        );
        missingKeys.forEach((k) => console.error(`     - ${k}`));
      }

      if (extraKeys.length > 0) {
        console.warn(
          `  ⚠️ [${locale}/${ns}.json] Extra keys (${extraKeys.length}):`,
        );
        extraKeys.forEach((k) => console.warn(`     - ${k}`));
      }
    }

    console.log("");
  }

  if (hasError) {
    console.error("❌ Locale check failed: missing keys detected.");
    process.exit(1);
  } else {
    console.log("✅ All locale files are consistent with base locale.");
  }
}

checkLocales();
