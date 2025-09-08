"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function AboutSection({ className }: { className?: string }) {
  const t = useTranslations("hackathon");

  return (
    <section className={cn("bg-gray-50 py-16 dark:bg-gray-900", className)}>
      <div className="container mx-auto max-w-[72rem] px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="mb-8 font-medium text-3xl text-gray-900 md:text-4xl dark:text-white">
            {t("about.title")}
          </h2>
          <div className="mx-auto max-w-3xl text-gray-600 text-lg leading-relaxed dark:text-gray-400">
            <p>{t("about.description")}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
