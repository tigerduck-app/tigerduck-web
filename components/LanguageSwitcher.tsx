"use client";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const toggleLocale = () => {
    let newPath = pathname;
    if (locale === "zh-TW") {
      newPath = `/en${pathname}`;
    } else {
      newPath = pathname.replace(/^\/en/, "") || "/";
    }
    router.push(newPath);
  };
  
  return (
    <button
      onClick={toggleLocale}
      className="text-sm px-2 py-1 rounded border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition-colors"
      aria-label={`Switch to ${locale === "zh-TW" ? "English" : "繁體中文"}`}
    >
      {locale === "zh-TW" ? "EN" : "中文"}
    </button>
  );
}
