import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { nextIntlRouting } from "@/lib/i18n";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(nextIntlRouting.locales, requested)
    ? requested
    : nextIntlRouting.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
