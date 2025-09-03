import type { Translations } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { ReactNode } from "react";
import { generateSiteMetadata } from "@/app/metadata.config";
import { nextIntlRouting } from "@/lib/i18n";
import cnMessages from "@/messages/cn.json";
import enMessages from "@/messages/en.json";

import "../global.css";

const inter = Inter({
  subsets: ["latin"],
});

const cn: Partial<Translations> = cnMessages.fuma;
const en: Partial<Translations> = enMessages.fuma;

const locales = [
  {
    name: "English",
    locale: "en",
  },
  {
    name: "中文",
    locale: "cn",
  },
];

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await paramsPromise;
  return generateSiteMetadata({ lang });
}

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  const messages = await getMessages({
    locale: lang,
  });

  if (!hasLocale(nextIntlRouting.locales, lang)) {
    notFound();
  }

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider locale={lang} messages={messages}>
          <RootProvider
            i18n={{
              locale: lang,
              locales: locales,
              translations: { cn, en }[lang],
            }}
          >
            {children}
          </RootProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
