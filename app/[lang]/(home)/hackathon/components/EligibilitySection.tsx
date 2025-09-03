"use client";

import {
  AlertTriangle,
  FileCheck,
  Hammer,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function EligibilitySection({ className }: { className?: string }) {
  const t = useTranslations("hackathon");

  const eligibility = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Open to All",
      description: t("eligibility.openToAll"),
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: <UserPlus className="h-6 w-6" />,
      title: "Team Formation",
      description: t("eligibility.teamFormation"),
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: <Hammer className="h-6 w-6" />,
      title: "Build with TEN",
      description: t("eligibility.buildWithTen"),
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: "Original Work",
      description: t("eligibility.originalWork"),
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

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
          <h2 className="mb-12 font-bold text-4xl text-gray-900 dark:text-white">
            {t("eligibility.title")}
          </h2>
        </motion.div>

        {/* Eligibility Rules */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          {eligibility.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-600 dark:bg-gray-800"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${rule.color} bg-current/10`}
              >
                <div className={`${rule.color}`}>{rule.icon}</div>
              </div>
              <h3 className="mb-3 font-semibold text-gray-900 text-lg dark:text-white">
                {rule.title}
              </h3>
              <p className="text-gray-600 leading-relaxed dark:text-gray-400">
                {rule.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Important Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-yellow-200 bg-yellow-50 p-8 dark:border-yellow-800 dark:bg-yellow-900/20"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-lg text-yellow-800 dark:text-yellow-200">
                Previous Winners Note
              </h3>
              <p className="text-yellow-700 leading-relaxed dark:text-yellow-300">
                {t("eligibility.note")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
