"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function AboutSection({ className }: { className?: string }) {
	const t = useTranslations("hackathon");

	return (
		<section className={cn("py-16 bg-gray-50 dark:bg-gray-900", className)}>
			<div className="container mx-auto max-w-[72rem] px-6">
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
					viewport={{ once: true }}
					className="mx-auto max-w-4xl text-center"
				>
					<h2 className="mb-8 text-3xl font-medium text-gray-900 dark:text-white md:text-4xl">
						{t("about.title")}
					</h2>
					<div className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
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
						className="flex flex-col items-center text-center p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
					>
						<div className="mb-2 text-xl">🏠</div>
						<h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
							Smart Homes
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Voice-controlled smart home devices
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.2, delay: 0.1 }}
						viewport={{ once: true }}
						className="flex flex-col items-center text-center p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
					>
						<div className="mb-2 text-xl">🤝</div>
						<h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
							Voice Companionship
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							AI companions and virtual assistants
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.2, delay: 0.15 }}
						viewport={{ once: true }}
						className="flex flex-col items-center text-center p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
					>
						<div className="mb-2 text-xl">🏢</div>
						<h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
							Enterprise Services
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Voice-powered business solutions
						</p>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
