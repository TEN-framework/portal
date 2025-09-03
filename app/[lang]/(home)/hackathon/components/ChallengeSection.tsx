"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Headphones, Home, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChallengeSection({ className }: { className?: string }) {
	const t = useTranslations("hackathon");

	const examples = [
		{
			icon: <Headphones className="h-8 w-8" />,
			title: t("challenge.serviceAgents"),
			gradient: "from-blue-500 to-cyan-500",
			bgGradient:
				"from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
		},
		{
			icon: <Home className="h-8 w-8" />,
			title: t("challenge.iotHardware"),
			gradient: "from-green-500 to-emerald-500",
			bgGradient:
				"from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
		},
		{
			icon: <Heart className="h-8 w-8" />,
			title: t("challenge.emotionalCompanions"),
			gradient: "from-purple-500 to-pink-500",
			bgGradient:
				"from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
		},
	];

	return (
		<section className={cn("py-16 bg-gray-50 dark:bg-gray-900 ", className)}>
			<div className="container mx-auto max-w-[72rem] px-6">
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
					viewport={{ once: true }}
					className="mx-auto max-w-4xl text-center"
				>
					<h2 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
						{t("challenge.title")}
					</h2>
					<p className="mb-12 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
						{t("challenge.description")}
					</p>
				</motion.div>

				{/* Examples Title */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.2, delay: 0.1 }}
					viewport={{ once: true }}
					className="mb-8 text-center"
				>
					<h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
						{t("challenge.examples")}
					</h3>
				</motion.div>

				{/* Examples Grid */}
				<div className="grid gap-8 md:grid-cols-3">
					{examples.map((example, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.2, delay: 0.05 * index }}
							viewport={{ once: true }}
							className="rounded-xl p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
						>
							<div className="">
								<div
									className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black border border-gray-200 dark:border-gray-700`}
								>
									{example.icon}
								</div>
								<p className="text-lg font-semibold leading-relaxed text-gray-800 dark:text-gray-200">
									{example.title}
								</p>
							</div>
						</motion.div>
					))}
				</div>

				{/* Additional Info */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.2, delay: 0.2 }}
					viewport={{ once: true }}
					className="mt-16 rounded-xl bg-gray-50 dark:bg-gray-800 p-8 text-center border border-gray-200 dark:border-gray-700"
				>
					<h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
						Technologies You Can Use
					</h3>
					<div className="flex flex-wrap justify-center gap-4">
						{[
							"ASR",
							"LLMs",
							"TTS",
							"SIP",
							"ESP32",
							"Computer Vision",
							"NLP",
						].map((tech) => (
							<span
								key={tech}
								className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300"
							>
								{tech}
							</span>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
