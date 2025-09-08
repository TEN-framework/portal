"use client";

import { ExternalLink, Mail, MessageCircle, Rocket } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CTASection({ className }: { className?: string }) {
  const t = useTranslations("hackathon");

  return (
    <section className={cn("bg-gray-900 py-16 dark:bg-gray-100", className)}>
      <div className="container mx-auto max-w-[72rem] px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center text-white dark:text-gray-900"
        >
          {/* Rocket Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              delay: 0.1,
            }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <motion.div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 30px rgba(255,255,255,0.3)",
              }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Rocket className="h-10 w-10 text-white" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-6 font-bold text-4xl md:text-6xl"
          >
            {t("cta.title")}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
            viewport={{ once: true }}
            className="mb-10 text-xl leading-relaxed opacity-90 md:text-2xl"
          >
            {t("cta.description")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 100,
              delay: 0.3,
            }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
          <a href="https://luma.com/y14vmjsu" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="gap-3 bg-white px-8 py-4 font-medium text-gray-900 text-lg hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              >
                {t("cta.register")}
                <ExternalLink className="h-5 w-5" />
              </Button>
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <a href="https://discord.gg/8AJkU7cU" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="gap-3 bg-white px-8 py-4 font-medium text-gray-900 text-lg hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              >
                {t("cta.joinDiscord")}
                <MessageCircle className="h-5 w-5" />
              </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-8 flex items-center justify-center gap-2 opacity-80"
          >
            <Mail className="h-5 w-5" />
            <span className="font-medium text-lg">
              Questions? Email us at {t("cta.email")}
            </span>
          </motion.div>
        </motion.div>

        {/* Stats or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 grid gap-8 text-center text-white sm:grid-cols-2 justify-items-center dark:text-gray-900"
        >
          <div className="flex flex-col items-center">
            <div className="mb-2 font-bold text-3xl">$11,000</div>
            <div className="text-lg opacity-80">Total Prize Pool</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2 font-bold text-3xl">Global</div>
            <div className="text-lg opacity-80">Online Event</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
