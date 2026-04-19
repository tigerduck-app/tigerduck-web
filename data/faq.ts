import type { FAQItem } from "@/types/faq";

export const faqItems: FAQItem[] = [
  {
    id: "sso-security",
    questionZh: "TigerDuck 安全嗎？我的 SSO 密碼會被儲存嗎？",
    questionEn: "Is TigerDuck safe? Will my SSO password be stored?",
    answerZh: "TigerDuck 使用 NTUST SSO 進行身份驗證，密碼不會被儲存在我們的伺服器上。所有認證流程都直接與學校系統進行。",
    answerEn: "TigerDuck uses NTUST SSO for authentication. Your password is never stored on our servers. All authentication happens directly with the school system.",
  },
  {
    id: "ntust-relation",
    questionZh: "TigerDuck 是 NTUST 官方 App 嗎？",
    questionEn: "Is TigerDuck an official NTUST app?",
    answerZh: "不是。TigerDuck 是由臺科大學生獨立開發的非官方工具，與臺灣科技大學沒有任何官方關聯。",
    answerEn: "No. TigerDuck is an unofficial tool independently developed by NTUST students. It has no official affiliation with National Taiwan University of Science and Technology.",
  },
  {
    id: "data-storage",
    questionZh: "我的資料會被儲存在哪裡？",
    questionEn: "Where is my data stored?",
    answerZh: "TigerDuck 的資料主要儲存在您的裝置本地，不會上傳到第三方伺服器。",
    answerEn: "TigerDuck stores data primarily on your device locally. No data is uploaded to third-party servers.",
  },
  {
    id: "requirements",
    questionZh: "系統需求是什麼？",
    questionEn: "What are the system requirements?",
    answerZh: "iOS 版本需要 iOS 18 以上；Android 版本需要 Android 8.0 以上。部分功能需要 NTUST 學生帳號。",
    answerEn: "iOS version requires iOS 18 or later. Android version requires Android 8.0 or later. Some features require an NTUST student account.",
  },
  {
    id: "beta-join",
    questionZh: "如何加入內測？",
    questionEn: "How do I join the beta?",
    answerZh: "iOS 用戶可透過 TestFlight 免費加入內測。Android 用戶請加入我們的 Discord 並開 ticket 申請內測資格。",
    answerEn: "iOS users can join the beta for free via TestFlight. Android users should join our Discord and open a ticket to apply for beta access.",
  },
  {
    id: "android-status",
    questionZh: "Android 版本什麼時候上架 Play Store？",
    questionEn: "When will the Android version be on the Play Store?",
    answerZh: "Android 版本目前正在申請 Google Play Store 和 F-Droid 上架，敬請期待。目前可透過 Discord 申請 APK 內測。",
    answerEn: "The Android version is currently applying for Google Play Store and F-Droid listing. Stay tuned. You can currently apply for APK beta access via Discord.",
  },
];
