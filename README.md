# TigerDuck Website

TigerDuck 官方網站，使用 Next.js 15 App Router + Cloudflare Workers 部署。

→ [主 repo](https://github.com/tigerduck-app/tigerduck-app)

## 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
# 開啟 http://localhost:3000
```

## Wrangler 本地預覽（模擬 Cloudflare Workers）

```bash
npm run preview
# 開啟 http://localhost:8787
```

## 部署到 Cloudflare Workers

```bash
# 1. 登入 Cloudflare
npx wrangler login

# 2. 建置 OpenNext worker
npm run cf-build

# 3. 部署
npm run deploy
```

> 部署前請確認已在 Cloudflare Dashboard 設定 `tigerduck.app` 的 custom domain route。

## Environment Variables

| 變數 | 說明 | 必填 |
|------|------|------|
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | Cloudflare Web Analytics token | 否 |
| `GITHUB_TOKEN` | GitHub API token（提高 rate limit） | 否 |

複製 `.dev.vars.example` 為 `.dev.vars` 並填入值（本地開發用）。

## 目錄結構

```
web/
├── app/
│   └── [locale]/          # i18n 路由（zh-TW / en）
│       ├── page.tsx        # 首頁（長捲動）
│       ├── privacy-policy/ # 隱私政策
│       └── delete-account/ # 刪除帳號
├── components/
│   ├── hero/              # 3D Hero（R3F）
│   ├── ios/               # iOS 玻璃擬態組件
│   ├── android/           # Android Material 3 組件
│   ├── features/          # 功能展示
│   ├── sections/          # Stats / Roadmap / Team / FAQ
│   ├── layout/            # Header / Footer
│   └── cta/               # CTA 按鈕
├── data/                  # 靜態資料（features, roadmap, faq）
├── lib/                   # 工具函式（github API, theme）
├── messages/              # i18n 訊息（zh-TW.json, en.json）
├── public/                # 靜態資源（screenshots, brand）
└── types/                 # TypeScript 型別定義
```

## 常見問題

**3D Hero 沒有顯示？**
→ 確認瀏覽器支援 WebGL。若不支援，會自動顯示靜態 fallback。

**Dark mode 閃屏（FOUC）？**
→ `app/layout.tsx` 已內嵌 inline script 在 `<head>` 中讀取 localStorage 並設定 `data-theme`，應已解決。

**OpenNext build 失敗？**
→ 確認 `next.config.ts` 有呼叫 `initOpenNextCloudflareForDev()`，且 `wrangler.jsonc` 的 `compatibility_flags` 包含 `nodejs_compat`。

## 貢獻

請參考根目錄的 [CONTRIBUTING](../README.md) 說明。
