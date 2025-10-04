# Azarin Ajor - Monorepo

این پروژه یک monorepo است که شامل frontend (Next.js) و backend (NestJS) می‌باشد.

## ساختار پروژه

```
azarin-ajor/
├── front/          # Frontend - Next.js
├── back/           # Backend - NestJS
├── package.json    # Root package.json
└── pnpm-workspace.yaml
```

## نصب وابستگی‌ها

```bash
# نصب همه وابستگی‌ها
pnpm install:all

# یا نصب جداگانه
pnpm --filter front install
pnpm --filter back install
```

## اجرای پروژه

### اجرای همزمان frontend و backend

```bash
pnpm dev
```

### اجرای جداگانه

```bash
# فقط frontend
pnpm dev:front

# فقط backend
pnpm dev:back
```

## Build کردن

### Build همزمان

```bash
pnpm build
```

### Build جداگانه

```bash
# فقط frontend
pnpm build:front

# فقط backend
pnpm build:back
```

## اجرای production

```bash
pnpm start
```

## دستورات مفید

```bash
# تست کردن
pnpm test

# لینت کردن
pnpm lint

# پاک کردن
pnpm clean

# مدیریت Database
pnpm db:up      # راه‌اندازی database
pnpm db:down    # توقف database
pnpm db:reset   # ریست database
```

## پورت‌ها

-   **Frontend**: http://localhost:3000
-   **Backend**: http://localhost:3001 (یا پورت تعریف شده در .env)

## نکات مهم

1. از `pnpm` به جای `npm` استفاده کنید
2. برای اجرای همزمان از `pnpm dev` استفاده کنید
3. هر پروژه می‌تواند مستقل اجرا شود
4. فایل‌های محیطی (.env) را در هر پروژه جداگانه تنظیم کنید
