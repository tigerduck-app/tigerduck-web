import type { Locale } from '@/lib/locale';

interface NavMessages {
  ariaLabel: string;
  gdg: string;
  github: string;
  discord: string;
  feedback: string;
  download: string;
}

interface HeroMessages {
  tagline: string;
  desc1: string;
  desc2: string;
  carouselAriaLabel: string;
  dotsAriaLabel: string;
  slideAriaLabel: (n: number, alt: string) => string;
  alts: {
    home: string;
    homeworks: string;
    classtable: string;
    calendar: string;
    announcement: string;
    library: string;
    grades: string;
    customize: string;
  };
}

interface WhyMessages {
  title: string;
  lede: string;
  items: { pain: string; sol: string }[];
}

interface FeaturesMessages {
  title: string;
  lede: string;
  prevAriaLabel: string;
  nextAriaLabel: string;
  goToAriaLabel: (n: number) => string;
  items: {
    tc: string;
    tagline: string;
    bullets: string[];
    alt: string;
  }[];
}

interface TechMessages {
  title: string;
  lede: string;
  privacy: { t: string; d: string }[];
  contributorsTitle: string;
  contributorsLede: string[];
}

interface RoadmapMessages {
  title: string;
  lede: string;
  cta: string;
  items: { t: string; d: string }[];
}

interface CTAMessages {
  title: string;
  lede: string;
}

interface FooterMessages {
  download: string;
  openSource: string;
  community: string;
  support: string;
  links: {
    iosApp: string;
    androidApp: string;
    iosRepo: string;
    androidRepo: string;
    license: string;
    discord: string;
    gdg: string;
    contributors: string;
    feedbackForm: string;
    privacy: string;
    deleteAccount: string;
  };
  copyright: string;
  org: string;
}

interface PrivacyMessages {
  documentTitle: string;
  back: string;
  eyebrow: string;
  title: string;
  lede: string;
  lastUpdated: string;
  contactTitle: string;
  contactPrefix: string;
  disclaimer: string;
  prefaceLabel: string;
  sections: { n: string; title: string }[];
  bodies: {
    intro: string;
    auth1: string;
    authReadIntro: string;
    authReadList: string[];
    authDirectTitle: string;
    authDirect: { body: string; footnoteId?: string }[];
    authIndirectTitle: string;
    authIndirect: { body: string; footnoteId?: string }[];
    storage: string;
    external: string;
    thirdParty: string;
    cookies: string;
    revisions: string;
    pushAnalyticsScope: string;
    pushAnalyticsPush: string;
    pushAnalyticsSchedule: string;
    pushAnalyticsAnalytics: string;
  };
  footnotes: { id: string; body: string }[];
}

interface DeleteAccountMessages {
  documentTitle: string;
  back: string;
  eyebrow: string;
  title: string;
  lede: string;
  lastUpdated: string;
  importantLabel: string;
  importantBody: string;
  s1Title: string;
  s1Body: string;
  s2Title: string;
  s2Intro: string;
  s2Steps: { label: string; body: string }[];
  s2AfterRemoval: string;
  s3Title: string;
  s3Prefix: string;
  s3LinkLabel: string;
  s3Suffix: string;
  s4Title: string;
  s4Scope: string;
  s4Push: string;
  s4Analytics: string;
  contactTitle: string;
  contactPrefix: string;
}

interface ThemeToggleMessages {
  labels: { auto: string; light: string; dark: string };
  current: (label: string) => string;
  switchTo: (current: string, next: string) => string;
}

interface LocaleToggleMessages {
  switchTo: (target: string) => string;
}

export interface Messages {
  documentTitle: string;
  htmlLang: string;
  nav: NavMessages;
  hero: HeroMessages;
  why: WhyMessages;
  features: FeaturesMessages;
  tech: TechMessages;
  roadmap: RoadmapMessages;
  cta: CTAMessages;
  footer: FooterMessages;
  privacy: PrivacyMessages;
  deleteAccount: DeleteAccountMessages;
  themeToggle: ThemeToggleMessages;
  localeToggle: LocaleToggleMessages;
}

const zh: Messages = {
  documentTitle: 'TigerDuck — 為臺科大學生打造的校園助手',
  htmlLang: 'zh-Hant',
  nav: {
    ariaLabel: '主導覽',
    gdg: 'GDG',
    github: 'GitHub',
    discord: 'Discord',
    feedback: '回饋',
    download: '下載',
  },
  hero: {
    tagline: '為臺科大學生打造的校園助手',
    desc1: '作業、課表、行事曆、公告、圖書館、成績都整合起來',
    desc2: '功能不夠？你提出我們都會做！',
    carouselAriaLabel: 'TigerDuck App 畫面輪播',
    dotsAriaLabel: '選擇畫面',
    slideAriaLabel: (n, alt) => `第 ${n} 張：${alt}`,
    alts: {
      home: '主畫面',
      homeworks: '作業列表畫面',
      classtable: '課表畫面',
      calendar: '行事曆畫面',
      announcement: '公告列表畫面',
      library: '圖書館 QR 畫面',
      grades: '歷年成績畫面',
      customize: '客製化設定畫面',
    },
  },
  why: {
    title: '為什麼要做這個？',
    lede: '一定是資工系學生閒著無聊，想把生活過得更懶才開發出來的',
    items: [
      {
        pain: '常翹課？總是記不住上課地點時間',
        sol: '動態島常駐於手機畫面，甚至連講座也能夠包含在裡面，想翹課都難（？',
      },
      {
        pain: '死到臨頭的 Moodle 作業通知？',
        sol: '客製化的通知時間，像你的起床鬧鐘一樣叫到你做完為止！',
      },
      {
        pain: '小朋友才做選擇，我全部都要！',
        sol: '完整開源，有想要的功能儘管說。有能力的話，也歡迎一起盡一份力！',
      },
    ],
  },
  features: {
    title: '來看看介紹巴',
    lede: '每個功能都是原生實作，不是醜醜的套殼瀏覽器',
    prevAriaLabel: '上一個功能',
    nextAriaLabel: '下一個功能',
    goToAriaLabel: (n) => `前往功能 ${n}`,
    items: [
      {
        tc: '作業',
        tagline: '還記得截止時間是 23:59 還是 00:00 嗎？',
        bullets: ['自動同步 Moodle 作業', '通知推播即時提醒', 'Live Activity 顯示倒數'],
        alt: '作業列表畫面',
      },
      {
        tc: '課表',
        tagline: '三個資料來源自動判斷，選課期間 0 延遲',
        bullets: ['課名太長自己調', '加課 / 刪課隨便你', 'Live Activity 提醒下一節課'],
        alt: '課表畫面',
      },
      {
        tc: '行事曆',
        tagline: '好像不能沒有的行事曆，但你真的會看嗎',
        bullets: ['訂閱學期行事曆', '作業截止時間', '聽說這次寒假比上課時間長'],
        alt: '行事曆畫面',
      },
      {
        tc: '公告',
        tagline: '郵件洗一排臺科公布欄，從不點開過',
        bullets: ['客製化訂閱通知', 'AI 自動分類與標記重要程度', '統一各處室文字排版'],
        alt: '公告列表畫面',
      },
      {
        tc: '圖書館',
        tagline: '隨點即開，借討論小間不再被鎖圖書館',
        bullets: [
          '一鍵生成入館 QR Code',
          '〔實作中〕討論小間狀態查詢',
          '〔實作中〕館藏快速搜尋',
        ],
        alt: '圖書館 QR 畫面',
      },
      {
        tc: '歷年成績',
        tagline: '不想面對，不想面對，不想面對',
        bullets: ['完整學期 GPA 與系 / 班排名', '各科成績檢索', '〔實作中〕畢業門檻試算'],
        alt: '歷年成績畫面',
      },
      {
        tc: '客製化',
        tagline: '你的 App 由你決定',
        bullets: ['各種元件排序', '各種主題色任選', '有缺再叫我們補！'],
        alt: '客製化設定畫面',
      },
    ],
  },
  tech: {
    title: '完整開源，工程與安全細節看光光',
    lede: '還在擔心嗎，連資安社幹部們都在用呢！',
    privacy: [
      { t: '帳密憑證只存本地', d: '所有資料留在手機上，不會經過網路！' },
      { t: '無收費、無廣告', d: '快吃土了，願意贊助我們一杯咖啡嗎？' },
      { t: '完整開源稽核', d: 'AGPL-3.0 授權，每一行程式碼都看得到' },
    ],
    contributorsTitle: '貢獻者',
    contributorsLede: ['主要來自開源技術開發研究社', 'Google Developer Groups on Campus | NTUST'],
  },
  roadmap: {
    title: '接下來會做的事',
    lede: '挑了幾個我們最想做的',
    cta: '查看完整規劃',
    items: [
      {
        t: '畢業門檻試算',
        d: '要延畢了啊！！！優先針對多使用者較多的科系實作，目前依序為資工系、電子系...',
      },
      {
        t: '選課',
        d: '告別每次都開一堆分頁。直接告訴你還缺哪些課，排進課表後長什麼樣子，並且志願序該怎麼排機率最高，直接在手機上選！',
      },
      {
        t: '討論小間借用',
        d: '預約系統超難用，那我們自己來做巴！',
      },
    ],
  },
  cta: {
    title: '試用一學期看看？',
    lede: '既然都看到這了，就按下去巴！',
  },
  footer: {
    download: '下載',
    openSource: '開源',
    community: '社群',
    support: '支援',
    links: {
      iosApp: 'iOS · TestFlight',
      androidApp: 'Android · Google Play',
      iosRepo: 'iOS Repository',
      androidRepo: 'Android Repository',
      license: 'AGPL-3.0',
      discord: 'Discord',
      gdg: 'GDG on Campus | NTUST',
      contributors: 'Contributors',
      feedbackForm: '回饋表單',
      privacy: '隱私政策',
      deleteAccount: '刪除帳號',
    },
    copyright: '© 2026 TigerDuck · 開源技術開發研究社',
    org: 'Google Developer Groups on Campus | NTUST',
  },
  privacy: {
    documentTitle: '隱私政策 — TigerDuck',
    back: '← 回首頁',
    eyebrow: 'Privacy',
    title: '隱私政策',
    lede: 'TigerDuck 處理的大多數資料都留在你的裝置上。推播通知與選用的診斷功能是例外，下方依平台（iOS App Store / Google Play / F-Droid）分別說明。',
    lastUpdated: '最後更新',
    contactTitle: '聯絡我們',
    contactPrefix: '對隱私政策有任何疑問，歡迎來信：',
    disclaimer: '本軟體為臺科大學生自主開發，並非 NTUST 官方專案。',
    prefaceLabel: '前言',
    sections: [
      { n: '01', title: '個人資料的收集、處理與使用' },
      { n: '02', title: '資料保護' },
      { n: '03', title: '外部連結' },
      { n: '04', title: '與第三方共享資料' },
      { n: '05', title: 'Cookies 與追蹤技術' },
      { n: '06', title: '隱私政策的修訂' },
      { n: '07', title: '推播通知與診斷工具（依平台）' },
    ],
    bodies: {
      intro:
        'TigerDuck 由臺科大學生開發，珍視每位使用者的隱私。本政策說明我們如何收集、使用與保護你的個人資料。繼續使用本應用程式即表示你接受本條款。',
      auth1:
        'App 採用 NTUST SSO（Single Sign-On）進行身份驗證。為了避免每次開啟 App 都要重新登入，登入後我們會把**學號與密碼**及衍生的存取憑證**加密儲存在你裝置的安全儲存區**（iOS：Keychain；Android：以 Android Keystore 加密的 SharedPreferences）。**這些資料只會用來向 NTUST、Moodle 與圖書館的官方端點登入，不會傳送到我們的伺服器或任何第三方**，也可在「設定 → 登出」隨時清除。',
      authReadIntro: '會被讀取的資料包含：',
      authReadList: [
        '學號（用於 SSO 登入）',
        '課表資料（從選課系統同步）',
        '作業資料（從 Moodle 同步）',
        '圖書館帳號資訊（用於入館 QR Code 功能）',
      ],
      authDirectTitle: '直接取得的資訊',
      authDirect: [
        { body: '學號' },
        { body: '校務系統密碼' },
        { body: '圖書館系統密碼', footnoteId: '1' },
      ],
      authIndirectTitle: '間接取得的資訊',
      authIndirect: [
        { body: 'Moodle Token' },
        { body: 'Moodle 作業資料' },
        { body: '歷年成績' },
        { body: '圖書館入館 QR Code' },
        { body: '選課系統 → 當前學期課表' },
      ],
      storage:
        '臺科大校內服務的個人資料（學號、密碼、課表、作業、圖書館帳號、SSO Token 等）**儲存在你自己的裝置上的安全儲存區**。我們不會在雲端建立任何學生資料的資料庫。推播功能（詳見第 07 節）會讓部分資料經過我們的伺服器轉發，但僅限於推播投遞範圍（通知觸發後即清除），不會被彙整成個人檔案。',
      external:
        'App 內可能連結至外部網站（NTUST 官網、Moodle 等）。這些網站有自己的隱私政策，TigerDuck 對其內容不負任何責任。',
      thirdParty:
        '我們**不會販售或出租**你的個人資料給任何人。我們僅在以下功能所需範圍內使用第三方處理者：**Apple APNs**（iOS 推播）、**Google FCM**（Google Play Android 推播）、**Firebase Analytics**（Google Play）用於彙整使用情境，以及 **Sentry**（iOS App Store）用於 Crash 與錯誤診斷。F-Droid 版本完全不使用上述任一服務。我們絕不會將資料用於廣告或行銷。',
      cookies:
        'App 不使用 Cookies。**Google Play 版本內建 Firebase Analytics SDK** 收集彙整的使用情境資料；**iOS App Store 版本內建 Sentry SDK** 收集 Crash 與錯誤事件。F-Droid 版本則不含任何此類 SDK。',
      revisions: '我們保留隨時修訂本政策的權利。若有重大變更，會在本頁公告，並同步更新「最後更新日期」。',
      pushAnalyticsScope:
        '各版本涵蓋範圍不同。**iOS App Store 版本**：推播使用 Apple APNs 與我們的伺服器，並內建 Sentry SDK 收集 Crash 與錯誤回報。**Google Play Android 版本**：推播使用 Google FCM 與我們的伺服器，並內建 Firebase Analytics SDK 收集使用情境。**F-Droid Android 版本**：不會傳送任何資料，本節內容均不適用。',
      pushAnalyticsPush:
        '啟用推播通知時，我們會把下列資料傳送到我們的伺服器（**api.tigerduck.app**）與平台推播服務（iOS 為 Apple APNs、Android 為 Google FCM）：平台推播 Token、隨機產生的裝置識別碼，以及（若你已登入）學號。我們不會傳送任何公告內容或其他個人資料。你可以隨時在「設定 → 通知」關閉。',
      pushAnalyticsSchedule:
        '僅 iOS：為了在上課前、上課中與作業即將到期時準時推送通知，iOS App 每次開啟時會把未來 48 小時內的課表（課程名稱、教室、老師、上下課時間）與作業（標題、截止時間）傳送到我們的伺服器。相關時間經過後伺服器會自動清除這些資料。請在「設定 → 通知」關閉推播以停止同步。',
      pushAnalyticsAnalytics:
        '**Google Play 版本的 Firebase Analytics SDK** 會將彙整的使用情境（畫面瀏覽、操作事件等）傳送至 Google 進行處理；不會傳送學號、姓名或其他可直接辨識你身分的資訊，亦不會用於廣告。**iOS App Store 版本的 Sentry SDK** 會將 App Crash 與錯誤事件傳送至 Sentry 進行處理；不會傳送學號、姓名或其他可直接辨識你身分的資訊，亦不會用於廣告。',
    },
    footnotes: [
      { id: '1', body: '需啟動實驗性功能。' },
    ],
  },
  deleteAccount: {
    documentTitle: '刪除帳號 — TigerDuck',
    back: '← 回首頁',
    eyebrow: 'Account · Deletion',
    title: '刪除帳號',
    lede: 'F-Droid 版本不會記錄任何資訊。iOS App Store 與 Google Play 版本僅在推播通知時使用伺服器；移除 App 即可清除本機資料，伺服器端的清理方式請見下方第 04 節。',
    lastUpdated: '最後更新',
    importantLabel: '重要說明',
    importantBody:
      'TigerDuck 與國立臺灣科技大學無隸屬關係。開發團隊不擁有任何帳號管理權限。',
    s1Title: '關於帳號刪除',
    s1Body:
      'TigerDuck 透過 NTUST 的 SSO 系統做使用者驗證。**App 本身不建立、也不維護任何使用者帳號**，因此沒有「從 TigerDuck 刪除帳號」這個動作。',
    s2Title: '如何清除你的資料',
    s2Intro: '所有資料都只存在你自己的裝置上。要清除它，把 App 移除就好：',
    s2Steps: [
      { label: 'iOS', body: '從主畫面長按 TigerDuck → 移除 App → 刪除 App' },
      { label: 'Android', body: '從應用程式列表長按 TigerDuck → 解除安裝' },
    ],
    s2AfterRemoval: 'App 移除後，本機資料會自動一併清除',
    s3Title: '關於 NTUST 學校帳號',
    s3Prefix: '如果你要修改或刪除學校帳號本身，請直接聯繫',
    s3LinkLabel: '臺科大電子計算機中心',
    s3Suffix: '。TigerDuck 團隊沒有任何學校帳號的管理權限。',
    s4Title: '推播與診斷工具的伺服器端資料',
    s4Scope:
      '本節僅適用於 iOS App Store 與 Google Play 版本。**F-Droid 版本不會傳送任何資料到我們的伺服器**，可忽略本節。',
    s4Push:
      '若你曾啟用推播通知，我們的伺服器（**api.tigerduck.app**）可能持有：平台推播 Token、隨機產生的裝置識別碼、學號（若你已登入），以及 iOS 端為了排程通知所暫存的近 48 小時課表/作業。**在「設定 → 通知」關閉推播並移除 App 後，這些資料便不會再被使用**；課表/作業排程資料會在對應時間經過後自動清除，其餘識別資訊會在裝置長時間未活動後一併清理。若需要立即刪除，請見下方「聯絡我們」。',
    s4Analytics:
      '**Google Play 版本的 Firebase Analytics**：使用情境資料由 Google 依其隱私政策處理；我們的伺服器不會留有副本，要停止收集請移除 App。**iOS App Store 版本的 Sentry**：Crash 與錯誤事件由 Sentry 依其隱私政策處理；我們的伺服器不會留有副本，要停止收集請移除 App。',
    contactTitle: '聯絡我們',
    contactPrefix: '其他問題歡迎來信：',
  },
  themeToggle: {
    labels: { auto: '跟隨系統', light: '淺色模式', dark: '深色模式' },
    current: (label) => `目前：${label}（點擊切換）`,
    switchTo: (current, next) => `目前為${current}，點擊切換到${next}`,
  },
  localeToggle: {
    switchTo: (target) => `切換到${target}`,
  },
};

const en: Messages = {
  documentTitle: 'TigerDuck — A campus companion for NTUST students',
  htmlLang: 'en',
  nav: {
    ariaLabel: 'Main navigation',
    gdg: 'GDG',
    github: 'GitHub',
    discord: 'Discord',
    feedback: 'Feedback',
    download: 'Download',
  },
  hero: {
    tagline: 'A campus companion for NTUST students',
    desc1: 'Homework, timetable, calendar, announcements, library, and grades — all in one place.',
    desc2: 'Missing a feature? Tell us, and we\'ll build it.',
    carouselAriaLabel: 'TigerDuck app screenshot carousel',
    dotsAriaLabel: 'Choose screenshot',
    slideAriaLabel: (n, alt) => `Slide ${n}: ${alt}`,
    alts: {
      home: 'Home screen',
      homeworks: 'Homework list',
      classtable: 'Timetable',
      calendar: 'Calendar',
      announcement: 'Announcements list',
      library: 'Library QR code',
      grades: 'Grades history',
      customize: 'Customization settings',
    },
  },
  why: {
    title: 'Why we built this',
    lede: 'A few CS students with too much free time wanted a lazier campus life.',
    items: [
      {
        pain: 'Skipping class? Can never remember where or when it starts.',
        sol: 'Live Activity stays on your screen — even guest lectures are covered. Try skipping now.',
      },
      {
        pain: 'Last-minute Moodle homework alerts?',
        sol: 'Custom reminders that nag you like an alarm clock — until it\'s actually done.',
      },
      {
        pain: 'Why pick? I want all of it.',
        sol: 'Fully open source. Got a feature in mind? Tell us — or send a PR.',
      },
    ],
  },
  features: {
    title: 'Take a look',
    lede: 'Every feature is built natively — not a wrapped-up web view.',
    prevAriaLabel: 'Previous feature',
    nextAriaLabel: 'Next feature',
    goToAriaLabel: (n) => `Go to feature ${n}`,
    items: [
      {
        tc: 'Homework',
        tagline: 'Was it 23:59 or 00:00? Stop guessing.',
        bullets: [
          'Auto-syncs from Moodle',
          'Push notifications keep you on track',
          'Live Activity counts down for you',
        ],
        alt: 'Homework list',
      },
      {
        tc: 'Timetable',
        tagline: 'Three sources merged automatically. Zero lag during course selection.',
        bullets: [
          'Rename overly long course titles',
          'Add or drop courses freely',
          'Live Activity hints the next class',
        ],
        alt: 'Timetable',
      },
      {
        tc: 'Calendar',
        tagline: 'You probably need it — even if you rarely look at it.',
        bullets: [
          'Subscribe to the academic calendar',
          'Homework deadlines on the same view',
          'Heard winter break is longer than the term',
        ],
        alt: 'Calendar',
      },
      {
        tc: 'Announcements',
        tagline: 'Bulletin emails you never opened. Now usable.',
        bullets: [
          'Subscribe and filter the way you want',
          'AI auto-tags topics and importance',
          'Unified typography across departments',
        ],
        alt: 'Announcements list',
      },
      {
        tc: 'Library',
        tagline: 'Tap once. Stop getting locked out of the study room.',
        bullets: [
          'One-tap entry QR code',
          '[WIP] Study room availability',
          '[WIP] Catalog quick search',
        ],
        alt: 'Library QR code',
      },
      {
        tc: 'Grades',
        tagline: 'Not ready to look. Still not ready. Never ready.',
        bullets: [
          'Full GPA, plus department / class rank',
          'Search any course\'s grade',
          '[WIP] Graduation requirement check',
        ],
        alt: 'Grades history',
      },
      {
        tc: 'Customization',
        tagline: 'Your app, your call.',
        bullets: [
          'Reorder modules freely',
          'Pick your own theme color',
          'Need something else? Just ask.',
        ],
        alt: 'Customization settings',
      },
    ],
  },
  tech: {
    title: 'Fully open source. Engineering and security on display.',
    lede: 'Even campus security club leaders use it — what are you waiting for?',
    privacy: [
      {
        t: 'Credentials stay on device',
        d: 'Your data lives on your phone. It never travels through our servers.',
      },
      {
        t: 'No fees, no ads',
        d: 'We\'re running on instant noodles. Coffee donations are welcome.',
      },
      {
        t: 'Full source-code audit',
        d: 'AGPL-3.0 licensed. Every line is on GitHub.',
      },
    ],
    contributorsTitle: 'Contributors',
    contributorsLede: [
      'Google Developer Groups on Campus | NTUST',
    ],
  },
  roadmap: {
    title: 'What\'s next',
    lede: 'A handful of things we\'re most excited to build.',
    cta: 'View full roadmap',
    items: [
      {
        t: 'Graduation requirement check',
        d: 'Avoid the extra year. Rolling out by department demand: CS first, then EE, and so on.',
      },
      {
        t: 'Course selection',
        d: 'No more juggling tabs. See what\'s missing, preview your timetable, and rank picks for best odds — all on your phone.',
      },
      {
        t: 'Study room booking',
        d: 'The official portal is painful. So we\'re building our own.',
      },
    ],
  },
  cta: {
    title: 'Try it for a semester?',
    lede: 'You made it this far — just tap one of these.',
  },
  footer: {
    download: 'Download',
    openSource: 'Open Source',
    community: 'Community',
    support: 'Support',
    links: {
      iosApp: 'iOS · TestFlight',
      androidApp: 'Android · Google Play',
      iosRepo: 'iOS repository',
      androidRepo: 'Android repository',
      license: 'AGPL-3.0',
      discord: 'Discord',
      gdg: 'GDG on Campus | NTUST',
      contributors: 'Contributors',
      feedbackForm: 'Feedback form',
      privacy: 'Privacy policy',
      deleteAccount: 'Delete account',
    },
    copyright: '© 2026 TigerDuck',
    org: 'Google Developer Groups on Campus | NTUST',
  },
  privacy: {
    documentTitle: 'Privacy Policy — TigerDuck',
    back: '← Back to home',
    eyebrow: 'Privacy',
    title: 'Privacy Policy',
    lede: 'Most of the data TigerDuck handles stays on your device. Push notifications and optional diagnostics are the exceptions, and they differ by distribution channel (iOS App Store / Google Play / F-Droid) — see the breakdown below.',
    lastUpdated: 'Last updated',
    contactTitle: 'Contact us',
    contactPrefix: 'Questions about this privacy policy? Email us:',
    disclaimer: 'TigerDuck is built by NTUST students and is not an official NTUST project.',
    prefaceLabel: 'Preface',
    sections: [
      { n: '01', title: 'Collecting, processing, and using personal data' },
      { n: '02', title: 'Data protection' },
      { n: '03', title: 'External links' },
      { n: '04', title: 'Sharing data with third parties' },
      { n: '05', title: 'Cookies and tracking technologies' },
      { n: '06', title: 'Updates to this policy' },
      { n: '07', title: 'Push notifications and diagnostics (per platform)' },
    ],
    bodies: {
      intro:
        'TigerDuck is built by NTUST students and treats every user\'s privacy with care. This policy explains how we collect, use, and protect your personal data. By continuing to use the app, you agree to these terms.',
      auth1:
        'The app uses NTUST SSO (Single Sign-On) for authentication. So you do not have to sign in every time you open the app, after a successful login we **encrypt and store your student ID and password** along with the resulting access tokens in your device\'s secure storage (iOS Keychain on iOS; Android Keystore-encrypted SharedPreferences on Android). **These credentials are only ever sent to the official NTUST, Moodle, and library endpoints you log into — never to our server or any third party.** You can wipe them at any time via Settings → Sign out.',
      authReadIntro: 'Data we read includes:',
      authReadList: [
        'Student ID (used for SSO login)',
        'Timetable data (synced from the course-selection system)',
        'Homework data (synced from Moodle)',
        'Library account info (used for the entry QR code feature)',
      ],
      authDirectTitle: 'Information collected directly',
      authDirect: [
        { body: 'Student ID' },
        { body: 'NTUST portal password' },
        { body: 'Library system password', footnoteId: '1' },
      ],
      authIndirectTitle: 'Information obtained indirectly',
      authIndirect: [
        { body: 'Moodle token' },
        { body: 'Moodle homework data' },
        { body: 'Historical grade transcript' },
        { body: 'Library entry QR code' },
        { body: 'Current-semester timetable (from the course-selection system)' },
      ],
      storage:
        'Personal data tied to NTUST campus services (your student ID, password, timetable, homework, library account, SSO tokens, etc.) **lives on your own device, in secure storage**. We do not maintain any cloud database of student records. The push feature (see Section 07) routes some data through our server, but only for the lifetime of a notification dispatch — it is never aggregated into a user profile.',
      external:
        'The app may link to external sites (NTUST portals, Moodle, etc.). Those sites have their own privacy policies, and TigerDuck takes no responsibility for their content.',
      thirdParty:
        'We **do not sell or rent** your personal data to anyone. We only use third-party processors as required by specific features: **Apple APNs** (iOS push), **Google FCM** (Google Play Android push), **Firebase Analytics** (Google Play) for aggregate usage analytics, and **Sentry** (iOS App Store) for crash and error diagnostics. The F-Droid build uses none of the above. We never use your data for advertising or marketing.',
      cookies:
        'The app does not use cookies. **The Google Play build bundles the Firebase Analytics SDK** to collect aggregate usage data; **the iOS App Store build bundles the Sentry SDK** to collect crashes and error events. The F-Droid build contains no such SDKs.',
      revisions:
        'We may update this policy at any time. For material changes, we will post a notice on this page and update the "Last updated" date.',
      pushAnalyticsScope:
        'Coverage differs by build. **iOS App Store build**: push uses Apple APNs and our server, and the Sentry SDK is bundled to collect crash and error reports. **Google Play Android build**: push uses Google FCM and our server, and the Firebase Analytics SDK is bundled to collect aggregate usage events. **F-Droid Android build**: nothing in this section applies — no data is ever sent.',
      pushAnalyticsPush:
        'When push is enabled, we send the following to our server (**api.tigerduck.app**) and the platform push service (Apple APNs on iOS, Google FCM on Android): the platform push token, a randomly generated device identifier, and (if you are signed in) your student ID. We do not send announcement content or any other personal data. You can disable this any time in **Settings → Notifications**.',
      pushAnalyticsSchedule:
        'iOS only: to deliver class-start, in-class, and homework-deadline reminders on time, the iOS app uploads the next 48 hours of timetable entries (course name, classroom, instructor, start/end time) and homework (title, due time) to our server each time you open it. The server clears each entry automatically once its scheduled time has passed. Disable push in **Settings → Notifications** to stop this sync.',
      pushAnalyticsAnalytics:
        '**The Firebase Analytics SDK in the Google Play build** sends aggregate usage events (screen views, taps, etc.) to Google for processing. We do not send your student ID, name, or any directly identifying data through it, and we never use it for advertising. **The Sentry SDK in the iOS App Store build** forwards app crashes and error events to Sentry for processing. It does not send your student ID, name, or any directly identifying data, and we never use it for advertising.',
    },
    footnotes: [
      { id: '1', body: 'Requires the experimental feature toggle to be enabled.' },
    ],
  },
  deleteAccount: {
    documentTitle: 'Delete Account — TigerDuck',
    back: '← Back to home',
    eyebrow: 'Account · Deletion',
    title: 'Delete Account',
    lede: 'The F-Droid build records nothing. The iOS App Store and Google Play builds only contact our server for push notifications. Removing the app erases local data; for server-side cleanup, see Section 04 below.',
    lastUpdated: 'Last updated',
    importantLabel: 'Important',
    importantBody:
      'TigerDuck is not affiliated with National Taiwan University of Science and Technology. The dev team has no account-management privileges.',
    s1Title: 'About account deletion',
    s1Body:
      'TigerDuck authenticates users through NTUST SSO. **The app itself does not create or maintain any user account**, so there is no "delete from TigerDuck" action.',
    s2Title: 'How to wipe your data',
    s2Intro: 'All data lives on your own device. To clear it, simply remove the app:',
    s2Steps: [
      {
        label: 'iOS',
        body: 'From the home screen, long-press TigerDuck → Remove App → Delete App',
      },
      {
        label: 'Android',
        body: 'From the app drawer, long-press TigerDuck → Uninstall',
      },
    ],
    s2AfterRemoval: 'Once the app is removed, all local data is erased automatically.',
    s3Title: 'About your NTUST account',
    s3Prefix: 'To modify or delete your school account itself, contact',
    s3LinkLabel: 'the NTUST Electronic Computer Center',
    s3Suffix: ' directly. The TigerDuck team has no privileges over school accounts.',
    s4Title: 'Server-side data for push and diagnostics',
    s4Scope:
      'This section only applies to the iOS App Store and Google Play builds. **The F-Droid build never sends any data to our server** — you can ignore this section.',
    s4Push:
      'If you have ever enabled push notifications, our server (**api.tigerduck.app**) may hold: your platform push token, a randomly generated device identifier, your student ID (if signed in), and (iOS only) up to 48 hours of cached timetable / homework entries used to schedule notifications. **Disabling push in Settings → Notifications and removing the app stops further use of this data**; scheduling entries are cleared automatically as their time passes, and remaining identifiers are purged after long-term inactivity. To delete it immediately, contact us below.',
    s4Analytics:
      '**Firebase Analytics on the Google Play build**: usage data is processed by Google under their privacy policy; we do not keep a copy on our servers, and you can stop collection by removing the app. **Sentry on the iOS App Store build**: crash and error events are processed by Sentry under their privacy policy; we do not keep a copy on our servers, and you can stop collection by removing the app.',
    contactTitle: 'Contact us',
    contactPrefix: 'For other questions, email us:',
  },
  themeToggle: {
    labels: { auto: 'Follow system', light: 'Light mode', dark: 'Dark mode' },
    current: (label) => `Currently: ${label} (tap to switch)`,
    switchTo: (current, next) => `Currently ${current}. Tap to switch to ${next}.`,
  },
  localeToggle: {
    switchTo: (target) => `Switch to ${target}`,
  },
};

const dict: Record<Locale, Messages> = { zh, en };

export function tFor(locale: Locale): Messages {
  return dict[locale];
}
