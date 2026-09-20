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
    help: string;
    privacy: string;
    deleteAccount: string;
    tigersync: string;
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
    account: string;
    cloudSync: string;
    storage: string;
    external: string;
    thirdParty: string;
    cookies: string;
    revisions: string;
    pushAnalyticsScope: string;
    pushAnalyticsPush: string;
    pushAnalyticsBulletins: string;
    pushAppleDevicesTitle: string;
    pushAnalyticsSchedule: string;
    pushAnalyticsLiveActivity: string;
    pushAnalyticsSentry: string;
    pushAndroidDevicesTitle: string;
    pushAnalyticsWear: string;
    pushAnalyticsFirebase: string;
    pushAnalyticsFdroid: string;
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
  s2Steps: { label: string; body: string; platforms?: { label: string; body: string }[] }[];
  s3Title: string;
  s3Prefix: string;
  s3LinkLabel: string;
  s3Suffix: string;
  s4Title: string;
  s4Scope: string;
  s4Push: string;
  s4SignOut: string;
  s4Request: string;
  s4Analytics: string;
  contactTitle: string;
  contactPrefix: string;
}

interface TigerSyncMessages {
  documentTitle: string;
  back: string;
  eyebrow: string;
  title: string;
  lede: string;
  lastUpdated: string;
  importantLabel: string;
  importantBody: string;
  s1Title: string;
  s1Body: string[];
  s2Title: string;
  s2Intro: string;
  s2Items: { label: string; body: string }[];
  s3Title: string;
  s3Intro: string;
  s3Platforms: { title: string; body: string }[];
  s3Note: string;
  s4Title: string;
  s4Intro: string;
  s4DeviceTitle: string;
  s4Device: string[];
  s4AccountTitle: string;
  s4Account: string[];
  s4Note: string;
  s5Title: string;
  s5Prefix: string;
  s5LinkLabel: string;
  s5Suffix: string;
  contactTitle: string;
  contactPrefix: string;
}

interface HelpMailPlatformCopy {
  label: string;
  documentTitle: string;
  lede: string;
  appHint: string;
  steps: { label: string; body: string }[];
}

interface HelpReceiveMailMessages {
  back: string;
  eyebrow: string;
  title: string;
  lastUpdated: string;
  draftLabel: string;
  draftBody: string;
  s1Title: string;
  s1Intro: string;
  s1Items: string[];
  s2Title: string;
  /** Shown in place of the steps while no platform is picked. */
  s2Pending: string;
  s3Title: string;
  s3Intro: string;
  s3ImapTitle: string;
  s3Imap: { label: string; value: string }[];
  s3SmtpTitle: string;
  s3Smtp: { label: string; value: string }[];
  s3Note: string;
  s4Title: string;
  s4Items: { label: string; body: string }[];
  contactTitle: string;
  contactPrefix: string;
  /** Accessible label for the Android/Apple toggle (a `role="group"` wrapping
      the two toggle buttons). */
  platformToggleLabel: string;
  /** Keyed by the `/help/receive-mail/:platform` segment; `unknown` is the
      neutral fallback for a missing or unrecognised segment, and is also used
      to frame the page (lede/documentTitle) when the toggle has neither
      platform active. */
  platforms: {
    android: HelpMailPlatformCopy;
    apple: HelpMailPlatformCopy;
    unknown: HelpMailPlatformCopy;
  };
}

interface HelpTopicCopy {
  title: string;
  summary: string;
}

/**
 * `/help` — the topic index. One entry per topic; keyed by the id used in
 * `@/lib/help`'s registry, so adding a topic is one object there plus one
 * key here, no page markup changes.
 */
interface HelpIndexMessages {
  documentTitle: string;
  back: string;
  eyebrow: string;
  title: string;
  lede: string;
  topics: {
    receiveMail: HelpTopicCopy;
  };
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
  tigerSync: TigerSyncMessages;
  helpReceiveMail: HelpReceiveMailMessages;
  helpIndex: HelpIndexMessages;
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
      { t: '資料由你作主', d: '密碼只存在你的裝置上；TigerSync 可隨時在設定中關閉。' },
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
      iosApp: 'Apple · App Store',
      androidApp: 'Android · Google Play',
      iosRepo: 'Apple Repository',
      androidRepo: 'Android Repository',
      license: 'AGPL-3.0',
      discord: 'Discord',
      gdg: 'GDG on Campus | NTUST',
      contributors: 'Contributors',
      feedbackForm: '回饋表單',
      help: '其他幫助',
      privacy: '隱私政策',
      deleteAccount: '刪除帳號',
      tigersync: 'TigerSync',
    },
    copyright: '© 2026 TigerDuck · 開源技術開發研究社',
    org: 'Google Developer Groups on Campus | NTUST',
  },
  privacy: {
    documentTitle: '隱私政策 — TigerDuck',
    back: '← 回首頁',
    eyebrow: 'Privacy',
    title: '隱私政策',
    lede: 'TigerDuck 會把你的校務系統密碼留在裝置上。登入時也會在我們的伺服器建立一個帳號，供推播通知與 TigerSync 使用；伺服器持有哪些資料、各安裝來源（App Store / Google Play / F-Droid）有何差異，下方逐一說明。',
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
      { n: '07', title: '推播、公告與診斷工具（依平台）' },
    ],
    bodies: {
      intro:
        'TigerDuck 由臺科大學生開發，珍視每位使用者的隱私。本政策說明我們如何收集、使用與保護你的個人資料。繼續使用本應用程式即表示你接受本條款。',
      auth1:
        'App 透過 NTUST SSO（Single Sign-On）登入。為了避免每次開啟 App 都要重新登入，登入成功後我們會把**學號與密碼**及衍生的存取憑證**加密儲存在你裝置的安全儲存區**（Apple 裝置：Keychain；Android：以 Android Keystore 加密的 SharedPreferences）。這些憑證用來向 NTUST、Moodle 與圖書館的官方端點登入。**登入時，App 也會把學號、校務系統密碼與取得的 Moodle Token 一次性傳送到我們的伺服器（api.tigerduck.app）**，用以建立你的 TigerDuck 帳號（詳見下方）。伺服器只在仍需要取得 Moodle Token 時才會使用密碼，且**絕不儲存密碼**。你可以隨時在「設定 → 登出」清除本機憑證。',
      account:
        '**你的 TigerDuck 帳號。**在 App Store 或 Google Play 版本登入（F-Droid 版本在連得上我們伺服器時亦同）會在我們的伺服器建立一個以學號為鍵的帳號。伺服器為該帳號保存：學號、**加密後的 Moodle Token**（讓伺服器能代你抓取課程與作業，以排程提醒並讓各裝置保持同步，即使 App 沒開啟也能運作）、你登入過的裝置清單，以及下一段所述的 TigerSync 資料。Moodle Token 以輪替金鑰加密儲存，一旦 Moodle 拒絕該 Token 便立即標記失效。',
      cloudSync:
        '**TigerSync。**App Store 與 Google Play 版本的 TigerSync **預設開啟**，可在「**設定 → TigerSync**」整體或分類關閉。開啟期間，下列資料會儲存在我們的伺服器並在你登入的裝置間共享：各學期課表（課號、課名、授課教師、學分、教室、每週時段）、你手動新增或隱藏的課程、自訂的課程顏色與名稱、作業清單與你標記的已完成／忽略狀態，以及你設定的假日提醒例外。伺服器會保留 30 天的變更紀錄，以便離線過的裝置對齊。F-Droid 版本不會上傳上述任何資料。專案維護者可透過內部管理後台檢視帳號的同步資料以進行支援與除錯，不會對專案以外的任何人揭露。',
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
        '你的校務系統密碼、SSO 工作階段、圖書館帳號與歷年成績**只儲存在你自己的裝置上的安全儲存區**。TigerSync（第 01 節）與推播（第 07 節）涵蓋的資料會為你的帳號保存在我們的伺服器，絕不會被販售或彙整成其他用途的個人檔案，並依「刪除帳號」頁面所述的方式刪除。',
      external:
        'App 內可能連結至外部網站（NTUST 官網、Moodle 等）。這些網站有自己的隱私政策，TigerDuck 對其內容不負任何責任。',
      thirdParty:
        '我們**不會販售或出租**你的個人資料給任何人。我們僅在以下功能所需範圍內使用第三方處理者：**Apple APNs**（Apple 裝置推播）、**Google FCM**（Google Play Android 推播）、**Firebase Analytics**（Google Play，僅在你同意後啟用）用於彙整使用情境，以及 **Sentry**（App Store）用於 Crash 與錯誤診斷。F-Droid 版本完全不使用上述任一服務，只會連線臺科大的服務與我們自己的伺服器。我們絕不會將資料用於廣告或行銷。',
      cookies:
        'App 不使用 Cookies 追蹤你。**Google Play 版本內建 Firebase Analytics SDK**，在你於設定中開啟前不會啟用；**App Store 版本內建 Sentry SDK** 收集 Crash 與錯誤事件。F-Droid 版本則不含任何此類 SDK。',
      revisions: '我們保留隨時修訂本政策的權利。若有重大變更，會在本頁公告，並同步更新「最後更新日期」。',
      pushAnalyticsScope:
        '以下說明在推播、公告與診斷功能中，有哪些資料會離開你的裝置；實際內容會依你的裝置與安裝來源而有所不同。',
      pushAnalyticsPush:
        'App Store 與 Google Play 版本在你完成初次設定後——**不論是否登入**——就會向我們的伺服器（**api.tigerduck.app**）與平台推播服務（Apple 裝置為 Apple APNs、Android 為 Google FCM）註冊你的裝置。註冊內容包含：平台推播 Token、裝置識別碼（Apple 裝置為隨機 UUID；Android 為由 Android ID 衍生、重新安裝後仍相同的識別碼）、裝置類型（手機／平板／Mac）、App 與作業系統版本，以及你對「伺服器推播」的拒收設定。登入後，該裝置紀錄會與你的帳號連結。我們不會傳送任何公告內容或其他個人資料。你可以隨時在「設定 → 通知」拒收伺服器發送的通知。',
      pushAppleDevicesTitle: 'Apple 裝置',
      pushAnalyticsSchedule:
        '為了在上課前、上課中與作業即將到期時準時推送通知，Apple 裝置上的 App 每次開啟時會把未來 48 小時內的課表（課程名稱、教室、老師、上下課時間）與作業（標題、截止時間）傳送到我們的伺服器。**每次上傳都會覆蓋前一次的內容。**當你的裝置取消註冊時——也就是你登出，或推播服務回報你的 Token 已失效（例如你解除安裝 App 之後）——這些資料便會被移除。已送出的提醒可能會基於營運需求保留在伺服器，但絕不會被彙整成個人檔案。請在「設定 → 通知」關閉推播以停止同步。',
      pushAnalyticsLiveActivity:
        '若你啟用即時動態（Live Activities），App 可能會額外儲存一組鎖定畫面更新 Token 與相同的 48 小時快照，用於更新你鎖定畫面上的倒數。其移除規則與上述相同，閒置的 Token 會被自動清除。',
      pushAnalyticsBulletins:
        '公告：App 會顯示臺科大的公告。若你訂閱特定主題，你的訂閱條件（單位、標籤與篩選設定）會儲存在我們伺服器上你的帳號之下，用於推送符合條件的公告。我們不會收集你閱讀了哪些公告。這些條件會與你的帳號資料一併移除。',
      pushAnalyticsWear:
        'Android Wear OS：Wear OS 手錶 App 會從你的手機同步課表，並直接連線圖書館 API 產生入館 QR Code。它不會在我們的伺服器額外儲存任何個人資料。',
      pushAnalyticsSentry:
        '**Sentry（App Store 版本）**：App Crash 與錯誤事件會傳送至 Sentry 進行處理；不會傳送學號、姓名或其他可直接辨識你身分的資訊，亦不會用於廣告。',
      pushAndroidDevicesTitle: 'Android 裝置',
      pushAnalyticsFirebase:
        '**Firebase Analytics（Google Play 版本，需自行開啟）**：預設關閉。若你在設定中開啟分析，彙整的使用情境（畫面瀏覽、操作事件等）會傳送至 Google 進行處理；不會傳送學號、姓名或其他可直接辨識你身分的資訊，亦不會用於廣告。',
      pushAnalyticsFdroid:
        '**F-Droid 版本**：不含上述任何服務、沒有推播通知，也不會上傳你的課表或作業。但它仍會連線我們的伺服器下載公告與行事曆；在連得上伺服器時，登入也會建立第 01 節所述的伺服器帳號（學號與加密的 Moodle Token）。',
    },
    footnotes: [
      { id: '1', body: '需啟動實驗性功能。' },
    ],
  },
  deleteAccount: {
    documentTitle: '刪除帳號 — TigerDuck',
    back: '← 回首頁',
    eyebrow: '刪除帳號',
    title: '刪除帳號',
    lede: '移除 App 即可清除裝置上的所有資料。但 TigerDuck 後端保存的帳號與同步資料不會因為登出或解除安裝而自動刪除，需要來信要求：第 02 節是完整步驟，第 04 節說明後端保有哪些資料。',
    lastUpdated: '最後更新',
    importantLabel: '重要說明',
    importantBody:
      'TigerDuck 與國立臺灣科技大學無隸屬關係。開發團隊不擁有任何帳號管理權限。',
    s1Title: '關於刪除帳號',
    s1Body:
      'TigerDuck 透過 NTUST 的 SSO 系統驗證你的身分，但自 2.0 版起，登入也會在 TigerDuck 後端建立一個**TigerDuck 帳號**（以學號為鍵），供推播通知與跨裝置同步使用。App 內目前尚無刪除該帳號的按鈕，**完整刪除必須來信要求**；第 02 節是步驟，第 04 節說明後端保有哪些資料。',
    s2Title: '如何刪除你的資料',
    s2Intro:
      '本機資料存在你自己的裝置上，移除 App 就會清除；但 TigerDuck 後端保存的同步資料與帳號紀錄**不會**因為登出或解除安裝而自動刪除。請依序完成以下三個步驟：',
    s2Steps: [
      {
        label: '在 App 內登出',
        body: '前往「設定 → 帳號」登出。App 會順帶請後端移除這台裝置的紀錄（推播 Token、通知偏好）並撤銷其登入階段。這是一次盡力而為的請求：若當下沒有網路，該紀錄可能仍留在後端，由第 3 步一併處理。',
      },
      {
        label: '移除 App',
        body: 'App 移除後，這台裝置上的本機資料會自動一併清除。',
        platforms: [
          { label: 'Apple', body: '從主畫面長按 TigerDuck → 移除 App → 刪除 App' },
          { label: 'Android', body: '從應用程式列表長按 TigerDuck → 解除安裝' },
        ],
      },
      {
        label: '來信要求刪除全部資料',
        body: '**這一步不能省略**——登出與解除安裝都不會刪除 TigerDuck 後端保存的同步資料與帳號紀錄。請寄信到 {EMAIL}，說明你的學號並要求刪除全部資料，同時**註明是否需要我們提供刪除紀錄**（我們刪除了哪些資料、哪些裝置）。',
      },
    ],
    s3Title: '關於 NTUST 學校帳號',
    s3Prefix: '如果你要修改或刪除學校帳號本身，請直接聯繫',
    s3LinkLabel: '臺科大電子計算機中心',
    s3Suffix: '。TigerDuck 團隊沒有任何學校帳號的管理權限。',
    s4Title: 'TigerDuck 後端保存的資料（帳號、同步、推播）',
    s4Scope:
      '本節適用於 App Store 與 Google Play 版本。**F-Droid 版本不會註冊推播，也不會上傳同步資料**；但若你在連得上後端時登入，同樣會建立帳號紀錄（學號與加密的 Moodle Token），因此第 02 節的來信要求亦適用。',
    s4Push:
      'TigerDuck 後端（**api.tigerduck.app**）可能為你的帳號持有：學號、加密的 Moodle Token、每台裝置一筆紀錄（推播 Token、裝置識別碼、裝置類型、App 與作業系統版本、通知偏好）、跨裝置同步的資料（課表、手動新增或隱藏的課程、自訂顏色與名稱、作業標記、假日提醒例外，以及 30 天的變更紀錄）、公告訂閱條件，以及（Apple 裝置）用於排程通知的近 48 小時課表／作業。',
    s4SignOut:
      '**登出只會處理登出的那一台裝置**：後端會將該裝置標記為已刪除、撤銷其登入階段，並讓其推播 Token 失效。未登出就直接解除安裝，則要等推播服務回報 Token 失效後才會停止推播。**這兩種情況都不會刪除同步資料，也不會刪除帳號紀錄（學號與加密的 Moodle Token）**——這些資料會一直保留在後端，直到你來信要求刪除為止。',
    s4Request:
      '要完整刪除，請寄信到 {EMAIL}，說明你的學號並要求刪除全部資料，並註明是否需要我們提供刪除紀錄（我們刪除了哪些資料、哪些裝置）。我們會盡快處理。',
    s4Analytics:
      '**Google Play 版本的 Firebase Analytics** 只在你於設定中開啟後才會運作；使用情境資料由 Google 依其隱私政策處理，我們不留副本，關閉該設定或移除 App 即停止收集。**App Store 版本的 Sentry**：Crash 與錯誤事件由 Sentry 依其隱私政策處理，我們不留副本，移除 App 即停止收集。',
    contactTitle: '聯絡我們',
    contactPrefix: '其他問題歡迎來信：',
  },
  tigerSync: {
    documentTitle: 'TigerSync — TigerDuck',
    back: '← 回首頁',
    eyebrow: 'TigerSync',
    title: 'TigerSync',
    lede: 'TigerSync 是 TigerDuck 自己的後端伺服器，只為 TigerDuck App 服務。這一頁說明它是什麼、哪些資料會用到它、為什麼 iPhone / iPad 與 Android 的需求不同，以及它為每台裝置保存了什麼。',
    lastUpdated: '最後更新',
    importantLabel: '重要說明',
    importantBody:
      'TigerSync 由 TigerDuck 開發團隊架設與維護，不是臺科大的系統，也不由學校代管；它只為 TigerDuck App 服務。',
    s1Title: 'TigerSync 是什麼',
    s1Body: [
      'TigerSync 是 TigerDuck 的後端伺服器（**api.tigerduck.app**），也就是 App 中「設定 → TigerSync」所管理的服務。它讓你的 iPhone、iPad、Mac 與 Android 裝置共用同一份課表與作業狀態，替你準時送出通知，並提供學期日期、行事曆與公告等資訊。',
      '它**只為 TigerDuck App 服務**，由開發團隊自行架設，不是臺科大的系統，也不由學校代管。你的校務系統密碼不會存放在這裡，密碼只留在你自己的裝置上。',
    ],
    s2Title: '使用 TigerSync 的三類資料',
    s2Intro: 'App 的「設定 → TigerSync」把 TigerSync 分成三類，各自對應一個開關：',
    s2Items: [
      {
        label: '取得必要資訊（無法關閉）',
        body: '學期日期、行事曆與公告欄。這一類永遠開啟，因為沒有它 App 就無法顯示這些內容，而且都是從伺服器下載，不會上傳你的資料。公告的訂閱條件屬於各台裝置自己，不會在裝置間同步。',
      },
      {
        label: '同步課程資訊',
        body: '你的課表、自訂的課程顏色與名稱、作業清單與完成狀態、假日提醒例外，以及作業到期提醒與即時動態 / 即時更新的設定，會上傳並在你登入的裝置間同步。可以整體關閉，也可以在「同步內容」中逐項選擇。',
      },
      {
        label: '接收額外伺服器推播',
        body: '由開發者不定期推送的額外通知，不包含廣告內容與垃圾訊息。關閉後，這台裝置就不會再收到這類通知。',
      },
    ],
    s3Title: '為什麼 iPhone / iPad 需要開啟「同步課程資訊」才能接收通知，而 Android 不用',
    s3Intro:
      'iPhone 與 iPad 上的**作業到期提醒**與**即時動態**都由 TigerSync 送出，所以關閉「同步課程資訊」後這兩項功能就無法使用；Android 則由手機自己處理，不受這個開關影響。原因在於兩個平台允許 App 在背景做的事不同：',
    s3Platforms: [
      {
        title: 'iPhone / iPad',
        body: 'iOS 不允許 App 在背景定時更新資料，App 只能在你打開它時讀取作業。因此在手機上自行排定的提醒，永遠停在「上次開啟 App」的那一刻：之後才出的作業，在你下次打開 App 之前都不會有提醒。所以改由 TigerSync 代勞，伺服器替你向 Moodle 取得最新作業，再透過 Apple 的推播服務（APNs）準時送出提醒。即時動態也是如此：要在 App 沒有開啟時啟動、更新或結束鎖定畫面與動態島上的倒數，需要由伺服器透過推播完成。這些都需要伺服器知道你的課表與作業，也就是「同步課程資訊」上傳的內容。',
      },
      {
        title: 'Android',
        body: 'Android 允許 App 在背景定期醒來，也能在指定時間觸發鬧鐘，所以作業到期提醒與即時更新都由手機自己排程與更新，不需要經過伺服器。即使關閉「同步課程資訊」，這兩項功能在 Android 上仍照常運作。',
      },
    ],
    s3Note: 'Mac 版不接收通知，因此沒有這項差異。',
    s4Title: 'TigerSync 為每台裝置保存的資料',
    s4Intro:
      'App Store 與 Google Play 版本在完成初次設定後，每台裝置都會在 TigerSync 留下一筆紀錄；登入後，這筆紀錄會與你的帳號連結。',
    s4DeviceTitle: '每台裝置',
    s4Device: [
      '裝置 ID——也就是 App 在「TigerSync 狀態」中顯示的那一串（Apple 裝置為隨機產生的 UUID；Android 為由 Android ID 衍生、重新安裝後仍相同的識別碼）',
      '裝置類型（手機／平板／Mac）、App 與作業系統版本，以及介面語言（用來以你的語言發送通知）',
      '推播 Token（Apple 裝置為 APNs；Google Play 版 Android 為 FCM），以及開啟即時動態時的鎖定畫面更新 Token',
      '這台裝置的 TigerSync 開關：「同步課程資訊」與各項「同步內容」、「接收額外伺服器推播」，以及公告推播',
      '這台裝置的公告訂閱條件（單位、標籤與篩選設定），用來替這台裝置推送符合條件的公告；每台裝置各自設定，不會同步到其他裝置',
      '最近一次連線與登入的時間',
      '（僅 Apple 裝置）未來 48 小時內的課表與作業，用來排定通知與即時動態；每次上傳都會覆蓋前一次的內容',
    ],
    s4AccountTitle: '你的帳號（所有裝置共用）',
    s4Account: [
      '學號，以及加密後的 Moodle Token（讓伺服器能代你取得課程與作業）',
      '開啟「同步課程資訊」時上傳的資料：各學期課表、手動新增或隱藏的課程、自訂的課程顏色與名稱、作業清單與完成／忽略標記、假日提醒例外，以及作業到期提醒與即時動態 / 即時更新的設定',
      '30 天內的變更紀錄，讓離線過的裝置能對齊',
    ],
    s4Note:
      '你的校務系統密碼、圖書館帳號與歷年成績不會存放在 TigerSync，公告的已讀狀態也只留在裝置上。F-Droid 版本不會註冊推播，也不會上傳課表或作業；但若在連得上伺服器時登入，仍會建立帳號紀錄（學號與加密的 Moodle Token）。',
    s5Title: '從 TigerSync 移除你的資料',
    s5Prefix: '登出或解除安裝 App 都不會刪除 TigerSync 上的帳號與同步資料。若你希望移除，請依照',
    s5LinkLabel: '刪除帳號',
    s5Suffix: '頁面的步驟來信要求，我們會刪除你的帳號與所有同步資料。',
    contactTitle: '聯絡我們',
    contactPrefix: '對 TigerSync 有任何疑問，歡迎來信：',
  },
  helpReceiveMail: {
    back: '← 回首頁',
    eyebrow: '使用說明',
    title: '在信件 App 收校園信箱',
    lastUpdated: '最後更新',
    draftLabel: '範例內容（尚未定稿）',
    draftBody:
      '這一頁的步驟與伺服器設定目前都是示範用的假資料，正式說明稍後補上。版面與完成後的頁面相同，可以先用來測試 App 內嵌顯示的效果。',
    s1Title: '開始之前',
    s1Intro: '（範例）動手之前，先準備好這些：',
    s1Items: [
      '（範例）你的學號與校務系統密碼',
      '（範例）校園信箱位址，格式為「學號@mail.example.edu」',
      '（範例）一個支援 IMAP 的信件 App',
      '（範例）可以連上網路的環境；在校外可能需要先連上學校 VPN',
    ],
    s2Title: '新增帳號的步驟',
    s2Pending: '頁面正在撰寫中，敬請期待。',
    s3Title: '伺服器設定',
    s3Intro: '（範例）下列數值僅供版面測試，請勿照著填寫。',
    s3ImapTitle: '收信（IMAP）',
    s3Imap: [
      { label: '主機', value: 'imap.example.edu' },
      { label: '連接埠', value: '993' },
      { label: '加密方式', value: 'SSL / TLS' },
      { label: '使用者名稱', value: '學號@mail.example.edu' },
    ],
    s3SmtpTitle: '寄信（SMTP）',
    s3Smtp: [
      { label: '主機', value: 'smtp.example.edu' },
      { label: '連接埠', value: '587' },
      { label: '加密方式', value: 'STARTTLS' },
      { label: '驗證方式', value: '與收信相同的帳號密碼' },
    ],
    s3Note: '（範例）如果 App 問你「安全性類型」，選擇與上表相同的項目即可。',
    s4Title: '收不到信時',
    s4Items: [
      {
        label: '密碼一直被拒絕',
        body: '（範例）確認校務系統密碼最近是否變更過，並重新輸入一次。',
      },
      {
        label: '卡在「驗證中」',
        body: '（範例）改用行動網路再試一次，或確認連接埠沒有被目前的網路擋掉。',
      },
      {
        label: '收得到但寄不出去',
        body: '（範例）多半是 SMTP 的連接埠或加密方式填錯，回到上一節對照一次。',
      },
    ],
    contactTitle: '聯絡我們',
    contactPrefix: '照著做還是設定不起來？歡迎來信：',
    platformToggleLabel: '選擇平台',
    platforms: {
      android: {
        label: 'Android',
        documentTitle: '在 Android 收校園信箱 — TigerDuck',
        lede: '（範例）把臺科大校園信箱加進 Android 手機上的信件 App，就能和你其他的信箱一起收信。',
        appHint: '（範例）以下以 Gmail App 為例，其他信件 App 的選單名稱可能略有不同。',
        steps: [
          { label: '打開 Gmail App', body: '（範例）點右上角的頭像，選「新增其他帳戶」。' },
          {
            label: '選擇帳戶類型',
            body: '（範例）在清單中選「其他」，輸入你的校園信箱位址後按「下一步」。',
          },
          {
            label: '選「個人 (IMAP)」',
            body: '（範例）出現帳戶類型時選 IMAP，接著輸入校務系統密碼。',
          },
          {
            label: '填寫收信伺服器',
            body: '（範例）依下一節「伺服器設定」填入 IMAP 主機、連接埠與加密方式。',
          },
          {
            label: '填寫寄信伺服器',
            body: '（範例）同樣依下一節填入 SMTP 設定，並勾選「需要登入」。',
          },
          {
            label: '完成設定',
            body: '（範例）設定同步頻率與通知後按「完成」，App 就會開始收信。',
          },
        ],
      },
      apple: {
        label: 'iPhone / iPad',
        documentTitle: '在 iPhone 收校園信箱 — TigerDuck',
        lede: '（範例）把臺科大校園信箱加進 iPhone 或 iPad 內建的「郵件」App，就能和你其他的信箱一起收信。',
        appHint: '（範例）以下以內建的「郵件」App 為例，第三方信件 App 的選單名稱可能略有不同。',
        steps: [
          { label: '打開「設定」', body: '（範例）進入「應用程式 → 郵件 → 郵件帳號」。' },
          {
            label: '加入帳號',
            body: '（範例）點「加入帳號」，在清單最下方選「其他」。',
          },
          {
            label: '選「加入郵件帳號」',
            body: '（範例）填入姓名、校園信箱位址與校務系統密碼。',
          },
          { label: '選擇 IMAP', body: '（範例）在上方分頁選 IMAP，不要選 POP。' },
          {
            label: '填寫收信與寄信伺服器',
            body: '（範例）依下一節「伺服器設定」填入 IMAP 與 SMTP 的主機與帳號密碼。',
          },
          { label: '儲存', body: '（範例）按「儲存」，驗證通過後就會開始收信。' },
        ],
      },
      unknown: {
        label: '通用步驟',
        documentTitle: '在信件 App 收校園信箱 — TigerDuck',
        lede: '（範例）這個網址沒有指定平台，以下是不分平台的通用步驟；實際選單名稱請以你的信件 App 為準。',
        appHint: '（範例）各家信件 App 的用詞不同，但流程大致相同。',
        steps: [
          {
            label: '在信件 App 中新增帳號',
            body: '（範例）選擇「其他」或「其他郵件帳號」這類選項。',
          },
          {
            label: '輸入校園信箱與密碼',
            body: '（範例）帳號為你的校園信箱位址，密碼為校務系統密碼。',
          },
          { label: '選擇 IMAP', body: '（範例）若問你要 IMAP 還是 POP，選 IMAP。' },
          { label: '填寫伺服器設定', body: '（範例）依下一節填入收信與寄信伺服器。' },
          {
            label: '完成並測試',
            body: '（範例）儲存後寄一封信給自己，確認可以正常收發。',
          },
        ],
      },
    },
  },
  helpIndex: {
    documentTitle: '其他幫助 — TigerDuck',
    back: '← 回首頁',
    eyebrow: '其他幫助',
    title: '其他幫助',
    lede: '這裡收錄了其他校園相關軟體的額外操作幫助，會陸陸續續新增更多主題。',
    topics: {
      receiveMail: {
        title: '在信件 App 收校園信箱',
        summary: '把臺科大校園信箱加進手機或電腦上的信件 App，讓校園信箱和你其他信箱收在同一個地方。',
      },
    },
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
        t: 'Your data, your call',
        d: 'Passwords are stored only on your device. TigerSync is optional and can be switched off in Settings.',
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
      iosApp: 'Apple · App Store',
      androidApp: 'Android · Google Play',
      iosRepo: 'Apple repository',
      androidRepo: 'Android repository',
      license: 'AGPL-3.0',
      discord: 'Discord',
      gdg: 'GDG on Campus | NTUST',
      contributors: 'Contributors',
      feedbackForm: 'Feedback form',
      help: 'Other help',
      privacy: 'Privacy policy',
      deleteAccount: 'Delete account',
      tigersync: 'TigerSync',
    },
    copyright: '© 2026 TigerDuck',
    org: 'Google Developer Groups on Campus | NTUST',
  },
  privacy: {
    documentTitle: 'Privacy Policy — TigerDuck',
    back: '← Back to home',
    eyebrow: 'Privacy',
    title: 'Privacy Policy',
    lede: 'TigerDuck keeps your NTUST password on your device. Signing in also creates an account on our server so that push notifications and TigerSync can work; what the server holds, and how it differs by distribution channel (App Store / Google Play / F-Droid), is spelled out below.',
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
      { n: '07', title: 'Push, announcements, and diagnostics (per platform)' },
    ],
    bodies: {
      intro:
        'TigerDuck is built by NTUST students and treats every user\'s privacy with care. This policy explains how we collect, use, and protect your personal data. By continuing to use the app, you agree to these terms.',
      auth1:
        'The app signs in through NTUST SSO (Single Sign-On). So you do not have to sign in every time you open the app, after a successful login we **encrypt and store your student ID and password** along with the resulting access tokens in your device\'s secure storage (Keychain on Apple devices; Android Keystore-encrypted SharedPreferences on Android). These credentials are used to log in to the official NTUST, Moodle, and library endpoints. **During sign-in the app also sends your student ID, your NTUST password, and the Moodle token it obtained to our server (api.tigerduck.app) once**, to create your TigerDuck account (see below). The server uses the password only if it still needs to obtain a Moodle token and **never stores it**. You can wipe the local credentials at any time via Settings → Sign out.',
      account:
        '**Your TigerDuck account.** Signing in on the App Store or Google Play build (and on the F-Droid build, whenever our server is reachable) creates an account on our server keyed by your student ID. For that account the server keeps: your student ID, an **encrypted copy of your Moodle token** (so it can fetch your courses and homework on your behalf to schedule reminders and keep your devices in sync, even while the app is closed), the list of devices you have signed in on, and the cloud-sync data described next. The Moodle token is encrypted at rest with rotating keys and is marked invalid as soon as Moodle rejects it.',
      cloudSync:
        '**TigerSync.** TigerSync is **on by default** on the App Store and Google Play builds and can be turned off, in whole or per category, in **Settings → TigerSync**. While it is on, the following is stored on our server and shared between your signed-in devices: your timetable for each semester (course number, name, instructor, credits, classroom, weekly schedule), courses you added or hid by hand, your custom course colours and names, your homework list with your done / ignored marks, and your holiday reminder exceptions. A change log is kept for 30 days to reconcile devices that were offline. The F-Droid build never uploads any of this. Project maintainers can inspect an account\'s synced data through an internal admin portal for support and debugging; it is never shared outside the project.',
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
        'Your NTUST password, SSO session, library account, and grade transcript **live only on your own device, in secure storage**. Data covered by TigerSync (Section 01) and push (Section 07) is kept on our server for your account, is never sold or aggregated into a profile for any other purpose, and is deleted as described on the Delete Account page.',
      external:
        'The app may link to external sites (NTUST portals, Moodle, etc.). Those sites have their own privacy policies, and TigerDuck takes no responsibility for their content.',
      thirdParty:
        'We **do not sell or rent** your personal data to anyone. We only use third-party processors as required by specific features: **Apple APNs** (Apple push), **Google FCM** (Google Play Android push), **Firebase Analytics** (Google Play, only if you opt in) for aggregate usage analytics, and **Sentry** (App Store) for crash and error diagnostics. The F-Droid build uses none of the above and talks only to NTUST services and our own server. We never use your data for advertising or marketing.',
      cookies:
        'The app does not use cookies for tracking. **The Google Play build bundles the Firebase Analytics SDK**, which stays off until you enable analytics in Settings; **the App Store build bundles the Sentry SDK** to collect crashes and error events. The F-Droid build contains no such SDKs.',
      revisions:
        'We may update this policy at any time. For material changes, we will post a notice on this page and update the "Last updated" date.',
      pushAnalyticsScope:
        'Here is what leaves your device for push, announcements, and diagnostics. The specifics vary by your device and where you installed the app.',
      pushAnalyticsPush:
        'The App Store and Google Play builds register your device with our server (**api.tigerduck.app**) and the platform push service (Apple APNs on Apple devices, Google FCM on Android) **as soon as you finish onboarding, whether or not you are signed in**. The registration carries: the platform push token, a device identifier (a random UUID on Apple devices; on Android, an identifier derived from the Android ID that stays the same across reinstalls), your device type (phone / tablet / Mac), the app and OS version, and your "server push" opt-out. Once you sign in, the device record is linked to your account. We do not send announcement content or any other personal data. You can opt out of server-sent notifications any time in **Settings → Notifications**.',
      pushAppleDevicesTitle: 'Apple Devices',
      pushAnalyticsSchedule:
        'To deliver class-start, in-class, and homework-deadline reminders on time, the app on Apple devices uploads the next 48 hours of timetable entries (course name, classroom, instructor, start/end time) and homework (title, due time) to our server each time you open it. **Each upload replaces the previous set.** These entries are removed when your device is unregistered — which happens when you sign out, or when the push service reports your token is no longer valid (for example after you uninstall the app). Delivered reminders may be retained on the server for operational purposes but are never aggregated into a personal profile. Disable push in **Settings → Notifications** to stop this sync.',
      pushAnalyticsLiveActivity:
        'If you enable Live Activities, the app may also store a Lock Screen update token together with the same 48-hour snapshot so we can update the countdown on your Lock Screen. This follows the same removal rules as above, and inactive tokens are pruned automatically.',
      pushAnalyticsBulletins:
        'Announcements: the app shows NTUST bulletins. If you subscribe to specific topics, your subscription rules (organizations, tags, and filters) are stored on our server under your account so we can send you matching announcements. We do not collect which announcements you read. The rules are removed together with your account data.',
      pushAnalyticsWear:
        'Android Wear OS: the companion watch app mirrors your timetable from your phone and contacts the library API directly to generate your entry QR code. It does not store any additional personal data on our server.',
      pushAnalyticsSentry:
        '**Sentry (App Store build):** app crashes and error events are forwarded to Sentry for processing. It does not send your student ID, name, or any directly identifying data, and is never used for advertising.',
      pushAndroidDevicesTitle: 'Android Devices',
      pushAnalyticsFirebase:
        '**Firebase Analytics (Google Play build, opt-in):** off by default. If you turn on analytics in Settings, aggregate usage events (screen views, taps, etc.) are sent to Google for processing. It does not send your student ID, name, or any directly identifying data, and is never used for advertising.',
      pushAnalyticsFdroid:
        '**F-Droid build:** bundles none of these services, has no push notifications, and never uploads your timetable or homework. It still contacts our server to download announcements and the academic calendar, and signing in creates the same server account described in Section 01 (student ID plus an encrypted Moodle token) whenever our server is reachable.',
    },
    footnotes: [
      { id: '1', body: 'Requires the experimental feature toggle to be enabled.' },
    ],
  },
  deleteAccount: {
    documentTitle: 'Delete Account — TigerDuck',
    back: '← Back to home',
    eyebrow: 'Delete Account',
    title: 'Delete Account',
    lede: 'Removing the app erases everything stored on your device. The account and synced data held by the TigerDuck backend, however, are not deleted by signing out or uninstalling — you have to email us. Section 02 has the full steps; Section 04 lists what the backend holds.',
    lastUpdated: 'Last updated',
    importantLabel: 'Important',
    importantBody:
      'TigerDuck is not affiliated with National Taiwan University of Science and Technology. The dev team has no account-management privileges.',
    s1Title: 'About Account Deletion',
    s1Body:
      'TigerDuck authenticates you through NTUST SSO, but since version 2.0 signing in also creates a **TigerDuck account on our backend** (keyed by your student ID) so that push notifications and cross-device sync can work. There is no in-app button to delete that account yet — **full deletion has to be requested by email**. Section 02 has the steps; Section 04 describes what the backend holds.',
    s2Title: 'How to delete your data',
    s2Intro:
      'Local data lives on your own device and is erased when you remove the app. The synced data and account record held by the TigerDuck backend, however, are **not** deleted by signing out or uninstalling. Complete all three steps below:',
    s2Steps: [
      {
        label: 'Sign out in the app',
        body: "Go to Settings → Account and sign out. The app also asks the backend to remove this device's record (push token, notification preferences) and revoke its sessions. This is a best-effort request: if the device is offline at the time, that record may stay on the backend — step 3 covers it.",
      },
      {
        label: 'Remove the app',
        body: 'Once the app is removed, all local data on that device is erased automatically.',
        platforms: [
          {
            label: 'Apple',
            body: 'From the home screen, long-press TigerDuck → Remove App → Delete App',
          },
          {
            label: 'Android',
            body: 'From the app drawer, long-press TigerDuck → Uninstall',
          },
        ],
      },
      {
        label: 'Email us to request full deletion',
        body: '**Do not skip this step** — neither signing out nor uninstalling deletes the synced data or account record held by the TigerDuck backend. Email {EMAIL} with your student ID, ask us to delete all of your data, and **tell us whether you want a record of the deletion** (which data and which devices we removed).',
      },
    ],
    s3Title: 'About your NTUST account',
    s3Prefix: 'To modify or delete your school account itself, contact',
    s3LinkLabel: 'the NTUST Electronic Computer Center',
    s3Suffix: ' directly. The TigerDuck team has no privileges over school accounts.',
    s4Title: 'Data held by the TigerDuck backend (account, sync, push)',
    s4Scope:
      'This section applies to the App Store and Google Play builds. **The F-Droid build never registers for push or uploads synced data**, but if you signed in while the backend was reachable it created the same account record (student ID and encrypted Moodle token), so the email request in Section 02 applies to it too.',
    s4Push:
      'The TigerDuck backend (**api.tigerduck.app**) may hold, for your account: your student ID, an encrypted copy of your Moodle token, one record per device (push token, device identifier, device type, app and OS version, notification preferences), the data synced across your devices (timetables, hand-added or hidden courses, custom colours and names, homework marks, holiday reminder exceptions, and a 30-day change log), your announcement subscription rules, and (Apple devices) up to 48 hours of timetable and homework entries used to schedule notifications.',
    s4SignOut:
      "**Signing out only affects the device you signed out from**: the backend marks that device deleted, revokes its sessions, and invalidates its push token. Uninstalling without signing out stops delivery only once the push service reports the token as invalid. **Neither one deletes the synced data, and neither deletes the account record (student ID and encrypted Moodle token)** — those stay on the backend until you ask us to remove them.",
    s4Request:
      'For full deletion, email {EMAIL} with your student ID, ask us to delete all of your data, and say whether you want a record of the deletion (which data and which devices we removed). We will process it as soon as we can.',
    s4Analytics:
      '**Firebase Analytics on the Google Play build** only runs if you enabled it in Settings; usage data is processed by Google under their privacy policy, we keep no copy, and turning the setting off or removing the app stops collection. **Sentry on the App Store build**: crash and error events are processed by Sentry under their privacy policy; we keep no copy, and removing the app stops collection.',
    contactTitle: 'Contact us',
    contactPrefix: 'For other questions, email us:',
  },
  tigerSync: {
    documentTitle: 'TigerSync — TigerDuck',
    back: '← Back to home',
    eyebrow: 'TigerSync',
    title: 'TigerSync',
    lede: "TigerSync is TigerDuck's own backend server, and it serves the TigerDuck app only. This page covers what it is, which data uses it, why iPhone / iPad and Android need different things from it, and what it keeps for each of your devices.",
    lastUpdated: 'Last updated',
    importantLabel: 'Important',
    importantBody:
      'TigerSync is run and maintained by the TigerDuck team. It is not an NTUST system and is not hosted by the school; it serves the TigerDuck app only.',
    s1Title: 'What TigerSync is',
    s1Body: [
      "TigerSync is TigerDuck's backend server (**api.tigerduck.app**) — the service you manage in the app under Settings → TigerSync. It lets your iPhone, iPad, Mac and Android devices share one timetable and one set of homework states, delivers your notifications on time, and provides semester dates, the calendar and announcements.",
      'It **serves the TigerDuck app only**. The TigerDuck team runs it themselves; it is not an NTUST system and is not hosted by the school. Your NTUST password is never stored there — it stays on your own device.',
    ],
    s2Title: 'The three kinds of data that use TigerSync',
    s2Intro: "The app's Settings → TigerSync screen splits TigerSync into three kinds, each with its own switch:",
    s2Items: [
      {
        label: 'Essential information (Cannot be turned off)',
        body: 'Semester dates, the calendar and announcements. This one is always on, because the app cannot show any of that without it, and it only downloads from the server, never uploading your data. Announcement subscription rules belong to each device and are not synced between devices.',
      },
      {
        label: 'Sync course information',
        body: 'Your timetable, custom course colours and names, homework list and completion state, holiday reminder exceptions, and your assignment due reminder and Live Activity / Live Updates settings are uploaded and shared between your signed-in devices. Turn it off as a whole, or choose items one by one under Synced content.',
      },
      {
        label: 'Receive additional server notifications',
        body: 'Occasional extra notifications from the developers — never ads or spam. Turn it off and this device stops receiving them.',
      },
    ],
    s3Title: 'Why iPhone and iPad need Sync course information on to receive notifications, and Android does not',
    s3Intro:
      'On iPhone and iPad, **assignment due reminders** and **Live Activity** are both delivered by TigerSync, so turning Sync course information off disables them. Android handles both on the phone itself, so the switch does not affect them. The reason is what each platform lets an app do in the background:',
    s3Platforms: [
      {
        title: 'iPhone / iPad',
        body: "iOS does not let an app refresh its data in the background on a schedule; the app can only read your homework while you have it open. A reminder scheduled on the phone is therefore frozen at the last time you opened the app, and homework posted after that gets no reminder until you open it again. So TigerSync does it instead: the server fetches your latest homework from Moodle on your behalf and sends the reminder on time through Apple's push service (APNs). Live Activity works the same way — starting, updating or ending the countdown on your Lock Screen and in the Dynamic Island while the app is closed has to be done by the server, through push. All of this needs the server to know your timetable and homework, which is exactly what Sync course information uploads.",
      },
      {
        title: 'Android',
        body: 'Android lets an app wake up periodically in the background and fire alarms at set times, so assignment due reminders and Live Updates are scheduled and updated by the phone itself, without the server. They keep working on Android even with Sync course information off.',
      },
    ],
    s3Note: 'The Mac app does not receive notifications, so this difference does not apply to it.',
    s4Title: 'What TigerSync keeps for each device',
    s4Intro:
      'On the App Store and Google Play builds, every device leaves one record on TigerSync once you finish onboarding; when you sign in, that record is linked to your account.',
    s4DeviceTitle: 'For each device',
    s4Device: [
      'The device ID — the one the app shows under TigerSync Status (a random UUID on Apple devices; on Android, an identifier derived from the Android ID that stays the same across reinstalls)',
      'Device type (phone / tablet / Mac), app and OS version, and interface language (so notifications arrive in your language)',
      'Push tokens (APNs on Apple devices, FCM on the Google Play Android build), plus a Lock Screen update token while Live Activity is on',
      "This device's TigerSync switches: Sync course information and each Synced content item, Receive additional server notifications, and announcement push",
      "This device's announcement subscription rules (organizations, tags and filters), used to push matching announcements to it; each device has its own, and they are not synced to your other devices",
      'When it last connected and last signed in',
      '(Apple devices only) Your timetable and homework for the next 48 hours, used to schedule notifications and Live Activity; each upload replaces the previous one',
    ],
    s4AccountTitle: 'For your account (shared by all your devices)',
    s4Account: [
      'Your student ID and an encrypted copy of your Moodle token (so the server can fetch your courses and homework on your behalf)',
      'What Sync course information uploads: your timetable for each semester, courses you added or hid by hand, custom course colours and names, your homework list with done / ignored marks, holiday reminder exceptions, and your assignment due reminder and Live Activity / Live Updates settings',
      'A 30-day change log, so devices that were offline can catch up',
    ],
    s4Note:
      'Your NTUST password, library account and grade transcript are never stored on TigerSync, and which announcements you have read stays on your device. The F-Droid build never registers for push or uploads your timetable or homework, but signing in while the server is reachable still creates the account record (student ID and encrypted Moodle token).',
    s5Title: 'Removing your data from TigerSync',
    s5Prefix: 'Signing out or uninstalling the app does not delete your account or synced data on TigerSync. To have them removed, follow the steps on the',
    s5LinkLabel: 'Delete Account',
    s5Suffix: ' page and email us; we will delete your account and all of its synced data.',
    contactTitle: 'Contact us',
    contactPrefix: 'Questions about TigerSync? Email us:',
  },
  helpReceiveMail: {
    back: '← Back to home',
    eyebrow: 'Help',
    title: 'Read your school mail in a mail app',
    lastUpdated: 'Last updated',
    draftLabel: 'Sample content (not final)',
    draftBody:
      'The steps and server settings on this page are placeholder text for now; the real instructions are coming later. The layout matches the finished page, so it can already be used to check how the page looks inside the app.',
    s1Title: 'Before you start',
    s1Intro: '(Sample) Have these ready:',
    s1Items: [
      '(Sample) Your student ID and NTUST portal password',
      '(Sample) Your school mail address, in the form student-id@mail.example.edu',
      '(Sample) A mail app that supports IMAP',
      '(Sample) A working internet connection; off campus you may need the school VPN first',
    ],
    s2Title: 'Adding the account',
    s2Pending: 'This page is still being written — check back soon.',
    s3Title: 'Server settings',
    s3Intro: '(Sample) The values below are placeholders for layout testing — do not type them in.',
    s3ImapTitle: 'Incoming (IMAP)',
    s3Imap: [
      { label: 'Host', value: 'imap.example.edu' },
      { label: 'Port', value: '993' },
      { label: 'Encryption', value: 'SSL / TLS' },
      { label: 'Username', value: 'student-id@mail.example.edu' },
    ],
    s3SmtpTitle: 'Outgoing (SMTP)',
    s3Smtp: [
      { label: 'Host', value: 'smtp.example.edu' },
      { label: 'Port', value: '587' },
      { label: 'Encryption', value: 'STARTTLS' },
      { label: 'Authentication', value: 'Same username and password as incoming' },
    ],
    s3Note:
      '(Sample) If the app asks for a "security type", pick the same option as in the table above.',
    s4Title: 'If mail does not arrive',
    s4Items: [
      {
        label: 'The password keeps being rejected',
        body: '(Sample) Check whether your portal password changed recently, then type it again.',
      },
      {
        label: 'Stuck on "verifying"',
        body: '(Sample) Try again on mobile data, or check that the port is not blocked on your current network.',
      },
      {
        label: 'Mail arrives but will not send',
        body: '(Sample) Usually the SMTP port or encryption is wrong — go back to the previous section and compare.',
      },
    ],
    contactTitle: 'Contact us',
    contactPrefix: 'Followed the steps and it still will not connect? Email us:',
    platformToggleLabel: 'Choose a platform',
    platforms: {
      android: {
        label: 'Android',
        documentTitle: 'School mail on Android — TigerDuck',
        lede: '(Sample) Add your NTUST school mailbox to the mail app on your Android phone so it arrives alongside your other mail.',
        appHint:
          '(Sample) The steps below use the Gmail app; other mail apps name their menus slightly differently.',
        steps: [
          {
            label: 'Open the Gmail app',
            body: '(Sample) Tap your avatar in the top right, then "Add another account".',
          },
          {
            label: 'Pick the account type',
            body: '(Sample) Choose "Other" from the list, enter your school mail address and tap Next.',
          },
          {
            label: 'Choose "Personal (IMAP)"',
            body: '(Sample) Pick IMAP when asked for the account type, then enter your portal password.',
          },
          {
            label: 'Fill in the incoming server',
            body: '(Sample) Use the IMAP host, port and encryption from the Server settings section below.',
          },
          {
            label: 'Fill in the outgoing server',
            body: '(Sample) Use the SMTP values from the same section and tick "require sign-in".',
          },
          {
            label: 'Finish',
            body: '(Sample) Choose a sync frequency and notification settings, tap Done, and mail starts arriving.',
          },
        ],
      },
      apple: {
        label: 'iPhone / iPad',
        documentTitle: 'School mail on iPhone — TigerDuck',
        lede: '(Sample) Add your NTUST school mailbox to the built-in Mail app on your iPhone or iPad so it arrives alongside your other mail.',
        appHint:
          '(Sample) The steps below use the built-in Mail app; third-party mail apps name their menus slightly differently.',
        steps: [
          { label: 'Open Settings', body: '(Sample) Go to Apps → Mail → Mail Accounts.' },
          {
            label: 'Add the account',
            body: '(Sample) Tap "Add Account" and choose "Other" at the bottom of the list.',
          },
          {
            label: 'Choose "Add Mail Account"',
            body: '(Sample) Enter your name, school mail address and portal password.',
          },
          { label: 'Select IMAP', body: '(Sample) Pick the IMAP tab at the top, not POP.' },
          {
            label: 'Fill in both servers',
            body: '(Sample) Use the IMAP and SMTP hosts and credentials from the Server settings section below.',
          },
          {
            label: 'Save',
            body: '(Sample) Tap Save; once verification passes, mail starts arriving.',
          },
        ],
      },
      unknown: {
        label: 'Generic steps',
        documentTitle: 'School mail in a mail app — TigerDuck',
        lede: '(Sample) This address does not name a platform, so the steps below are the generic ones — follow the wording your own mail app uses.',
        appHint: '(Sample) Mail apps word things differently, but the flow is the same everywhere.',
        steps: [
          {
            label: 'Add an account in your mail app',
            body: '(Sample) Choose "Other" or "Other mail account".',
          },
          {
            label: 'Enter your school mail and password',
            body: '(Sample) The username is your school mail address; the password is your portal password.',
          },
          {
            label: 'Select IMAP',
            body: '(Sample) When asked for IMAP or POP, choose IMAP.',
          },
          {
            label: 'Fill in the server settings',
            body: '(Sample) Use the incoming and outgoing values from the section below.',
          },
          {
            label: 'Finish and test',
            body: '(Sample) Save, then send yourself a message to confirm it sends and arrives.',
          },
        ],
      },
    },
  },
  helpIndex: {
    documentTitle: 'Other help — TigerDuck',
    back: '← Back to home',
    eyebrow: 'Other help',
    title: 'Other help',
    lede: 'Extra guides for other campus-related apps. More topics will be added over time.',
    topics: {
      receiveMail: {
        title: 'Read your school mail in a mail app',
        summary:
          'Add your NTUST school mailbox to the mail app on your phone or computer, so it arrives alongside your other mail.',
      },
    },
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
