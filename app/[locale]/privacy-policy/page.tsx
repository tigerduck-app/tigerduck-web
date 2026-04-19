import { useLocale, useTranslations } from "next-intl";

type LocaleKey = "zh-TW" | "en";

type PolicySection = {
  title: string;
  body: string;
  list?: readonly string[];
};

type PolicyContent = {
  sections: readonly PolicySection[];
  contact: string;
  disclaimer: string;
};

const zhTwSections: PolicySection[] = [
  { title: "一、隱私權政策", body: "TigerDuck（以下簡稱「本應用程式」）非常重視您的隱私權。本隱私權政策說明我們如何蒐集、使用及保護您的個人資料。使用本應用程式即表示您同意本政策之條款。" },
  {
    title: "二、個人資料蒐集、處理及利用",
    body: "本應用程式使用 NTUST SSO（單一登入）進行身份驗證。我們不會儲存您的帳號密碼。應用程式僅在您的裝置本地儲存必要的認證 Token，用於存取學校相關服務。",
    list: ["學號（用於 SSO 登入）", "課表資料（從選課系統同步）", "作業資料（從 Moodle 同步）", "圖書館帳號（用於 QR Code 功能）"],
  },
  { title: "三、資料保護", body: "所有資料均儲存於您的裝置本地，不會上傳至第三方伺服器。我們採用業界標準的安全措施保護您的資料。" },
  { title: "四、外部連結", body: "本應用程式可能包含連結至外部網站（如 NTUST 官方網站、Moodle 等）。這些外部網站有其各自的隱私權政策，本應用程式不對其內容負責。" },
  { title: "五、與第三人共用個人資料", body: "本應用程式不會將您的個人資料出售、出租或以其他方式提供給第三方，除非法律要求或經您明確同意。" },
  { title: "六、Cookie 及追蹤技術", body: "本應用程式不使用 Cookie 或其他追蹤技術蒐集您的個人資料。" },
  { title: "七、隱私權政策修正", body: "本應用程式保留隨時修改本隱私權政策的權利。修改後的政策將於本頁面公告，請定期查閱。" },
];

const enSections: PolicySection[] = [
  { title: "1. Privacy Policy", body: "TigerDuck values your privacy. This policy explains how we collect, use, and protect your personal information. By using the App, you agree to this policy." },
  {
    title: "2. Collection, Use, and Processing of Personal Data",
    body: "The App uses NTUST SSO for authentication. We do not store your account password. The App only stores the minimum authentication token locally on your device to access school-related services.",
    list: ["Student ID (for SSO sign-in)", "Class schedule data (synced from the course selection system)", "Homework data (synced from Moodle)", "Library account data (for QR code features)"],
  },
  { title: "3. Data Protection", body: "All data is stored locally on your device and is not uploaded to third-party servers. We use industry-standard security measures to protect your data." },
  { title: "4. External Links", body: "The App may contain links to external websites such as NTUST or Moodle. These websites have their own privacy policies, and we are not responsible for their content." },
  { title: "5. Sharing Personal Data with Third Parties", body: "We do not sell, rent, or otherwise share your personal data with third parties unless required by law or with your explicit consent." },
  { title: "6. Cookies and Tracking Technologies", body: "The App does not use cookies or other tracking technologies to collect your personal data." },
  { title: "7. Changes to This Privacy Policy", body: "We may update this privacy policy at any time. Any changes will be posted on this page, so please check it periodically." },
];

const content: Record<LocaleKey, PolicyContent> = {
  "zh-TW": {
    sections: zhTwSections,
    contact: "如有任何疑問，請聯絡我們：",
    disclaimer: "本專案為學生獨立開發，非 NTUST 官方專案。",
  },
  en: {
    sections: enSections,
    contact: "If you have any questions, contact us at:",
    disclaimer: "This project is independently developed by students and is not an official NTUST project.",
  },
};

export default function PrivacyPolicyPage() {
  const t = useTranslations("policy");
  const locale = useLocale() as LocaleKey;
  const policy = content[locale] ?? content.en;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl bg-[var(--color-surface)] p-8 shadow-sm md:p-12">
          <h1 className="mb-2 text-3xl font-bold text-[var(--color-text)]">{t("title")}</h1>
          <p className="mb-8 text-sm text-[var(--color-muted)]">{t("lastUpdated")}</p>

          <div className="prose prose-sm max-w-none text-[var(--color-text)]">
            {policy.sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-4 mt-8 text-xl font-semibold">{section.title}</h2>
                <p className="leading-relaxed text-[var(--color-muted)]">{section.body}</p>
                {section.list ? (
                  <ul className="list-disc space-y-2 pl-6 text-[var(--color-muted)]">
                    {section.list.map((item: string) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <div className="mt-12 border-t border-[var(--color-border)] pt-8">
              <p className="text-sm text-[var(--color-muted)]">
                {policy.contact}
                <a className="ml-1 text-[var(--color-accent-blue)] hover:underline" href="mailto:tigerduckapp@gmail.com">
                  tigerduckapp@gmail.com
                </a>
              </p>
              <p className="mt-4 text-xs italic text-[var(--color-muted)]">{policy.disclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
