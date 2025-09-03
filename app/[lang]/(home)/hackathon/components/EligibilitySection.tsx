"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
	Users,
	UserPlus,
	Hammer,
	FileCheck,
	AlertTriangle,
} from "lucide-react";
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
		<section className={cn("py-16 bg-gray-50 dark:bg-gray-900 ", className)}>
			<div className="container mx-auto max-w-[72rem] px-6">
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
					viewport={{ once: true }}
					className="mx-auto max-w-4xl text-center"
				>
					<h2 className="mb-12 text-4xl font-bold text-gray-900 dark:text-white">
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
							className="rounded-2xl bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-600"
						>
							<div
								className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${rule.color} bg-current/10`}
							>
								<div className={`${rule.color}`}>{rule.icon}</div>
							</div>
							<h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
								{rule.title}
							</h3>
							<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
					className="rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 p-8 border border-yellow-200 dark:border-yellow-800"
				>
					<div className="flex items-start gap-4">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400">
							<AlertTriangle className="h-5 w-5" />
						</div>
						<div>
							<h3 className="mb-2 text-lg font-semibold text-yellow-800 dark:text-yellow-200">
								Previous Winners Note
							</h3>
							<p className="text-yellow-700 dark:text-yellow-300 leading-relaxed">
								{t("eligibility.note")}
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
