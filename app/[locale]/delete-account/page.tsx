import { useLocale, useTranslations } from "next-intl";

type LocaleKey = "zh-TW" | "en";

type DeleteAccountSection = {
  title: string;
  body: string;
  list?: readonly string[];
};

type DeleteAccountContent = {
  disclaimerTitle: string;
  disclaimer: string;
  sections: readonly DeleteAccountSection[];
  contact: string;
};

const zhTwSections: DeleteAccountSection[] = [
  { title: "關於帳號刪除", body: "TigerDuck 使用 NTUST 單一登入（SSO）系統進行身份驗證。本應用程式本身不建立或管理獨立帳號，因此無法直接刪除帳號。" },
  { title: "如何移除您的資料", body: "由於所有資料均儲存於您的裝置本地，您可以透過刪除 App 來移除本地資料。", list: ["在 iOS 設定中刪除 TigerDuck App", "在 Android 設定中解除安裝 TigerDuck", "刪除應用程式後，本地資料將一併清除"] },
  { title: "NTUST 帳號相關", body: "如需刪除或修改您的 NTUST 學校帳號，請直接聯絡臺灣科技大學計算機中心。本應用程式對學校帳號沒有任何管理權限。" },
];

const enSections: DeleteAccountSection[] = [
  { title: "About Account Deletion", body: "TigerDuck uses the NTUST single sign-on (SSO) system for authentication. The App does not create or manage a separate account, so we cannot delete an account directly." },
  { title: "How to Remove Your Data", body: "Because all data is stored locally on your device, you can remove local data by deleting the App.", list: ["Delete the TigerDuck App from iOS settings", "Uninstall TigerDuck from Android settings", "All local data will be removed when the App is deleted"] },
  { title: "NTUST Account Questions", body: "If you need to delete or change your NTUST school account, please contact the NTUST computer center directly. The App has no authority over school accounts." },
];

const content: Record<LocaleKey, DeleteAccountContent> = {
  "zh-TW": {
    disclaimerTitle: "重要說明",
    disclaimer: "本應用程式與臺灣科技大學沒有任何關聯（not affiliated with NTUST）。TigerDuck 使用 NTUST SSO 進行身份驗證，但我們沒有帳號管理權限。",
    sections: zhTwSections,
    contact: "如有任何疑問，請聯絡我們：",
  },
  en: {
    disclaimerTitle: "Important Notice",
    disclaimer: "This App is not affiliated with NTUST. TigerDuck uses NTUST SSO for authentication, but we do not have account management access.",
    sections: enSections,
    contact: "If you have any questions, contact us at:",
  },
};

export default function DeleteAccountPage() {
  const t = useTranslations("deleteAccount");
  const locale = useLocale() as LocaleKey;
  const page = content[locale] ?? content.en;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl bg-[var(--color-surface)] p-8 shadow-sm md:p-12">
          <h1 className="mb-2 text-3xl font-bold text-[var(--color-text)]">{t("title")}</h1>
          <p className="mb-8 text-sm text-[var(--color-muted)]">{t("lastUpdated")}</p>

          <div className="prose prose-sm max-w-none text-[var(--color-text)]">
            <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-700 dark:bg-amber-900/20">
              <h2 className="mb-2 text-lg font-semibold text-amber-800 dark:text-amber-200">{page.disclaimerTitle}</h2>
              <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-300">{page.disclaimer}</p>
            </div>

            {page.sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-4 mt-8 text-xl font-semibold">{section.title}</h2>
                <p className="leading-relaxed text-[var(--color-muted)]">{section.body}</p>
                {section.list ? (
                  <ol className="list-decimal space-y-2 pl-6 text-[var(--color-muted)]">
                    {section.list.map((item: string) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                ) : null}
              </section>
            ))}

            <div className="mt-12 border-t border-[var(--color-border)] pt-8">
              <p className="text-sm text-[var(--color-muted)]">
                {page.contact}
                <a className="ml-1 text-[var(--color-accent-blue)] hover:underline" href="mailto:tigerduckapp@gmail.com">
                  tigerduckapp@gmail.com
                </a>
              </p>
              <p className="mt-4 text-xs italic text-[var(--color-muted)]">{page.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
