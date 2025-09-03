"use client";

import { FileText, Hammer, Send, UserPlus, Users, Video } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function ParticipateSection({ className }: { className?: string }) {
  const t = useTranslations("hackathon");

  const steps = [
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: "Sign Up",
      description: t("participate.signUp"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Hammer className="h-8 w-8" />,
      title: "Build",
      description: t("participate.build"),
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Send className="h-8 w-8" />,
      title: "Submit",
      description: t("participate.submit"),
      color: "from-purple-500 to-pink-500",
    },
  ];

  const requirements = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: t("participate.projectName"),
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t("participate.teamInfo"),
    },
    {
      icon: <Hammer className="h-6 w-6" />,
      title: t("participate.features"),
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: t("participate.demo"),
    },
  ];

  return (
    <section className={cn("bg-white py-16 dark:bg-gray-950", className)}>
      <div className="container mx-auto max-w-[72rem] px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="mb-12 font-bold text-4xl text-gray-900 dark:text-white">
            {t("participate.title")}
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-6">
                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-black text-white dark:border-gray-700 dark:bg-white dark:text-black`}
                >
                  {step.icon}
                </div>
                <div className="-top-2 -right-2 absolute flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold text-gray-900 text-sm shadow-md dark:bg-gray-800 dark:text-white">
                  {index + 1}
                </div>
              </div>
              <h3 className="mb-3 font-bold text-gray-900 text-xl dark:text-white">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed dark:text-gray-400">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Submission Requirements */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-gray-200 bg-white/60 p-8 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/60"
        >
          <h3 className="mb-6 text-center font-bold text-2xl text-gray-900 dark:text-white">
            {t("participate.submissionTitle")}
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {requirements.map((req, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.05 * index }}
                viewport={{ once: true }}
                className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-black text-white dark:border-gray-700 dark:bg-white dark:text-black">
                  {req.icon}
                </div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {req.title}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
