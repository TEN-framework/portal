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

        {/* Simple Examples */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            viewport={{ once: true }}
            className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-2 text-xl">🏠</div>
            <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-white">
              Smart Homes
            </h3>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Voice-controlled smart home devices
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-2 text-xl">🤝</div>
            <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-white">
              Voice Companionship
            </h3>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              AI companions and virtual assistants
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
            viewport={{ once: true }}
            className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-2 text-xl">🏢</div>
            <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-white">
              Enterprise Services
            </h3>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Voice-powered business solutions
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
