"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { UserPlus, Hammer, Send, FileText, Users, Video } from "lucide-react";
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
		<section className={cn("py-16 bg-white dark:bg-gray-950 ", className)}>
			<div className="container mx-auto max-w-[72rem] px-6">
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
					viewport={{ once: true }}
					className="mx-auto max-w-4xl text-center"
				>
					<h2 className="mb-12 text-4xl font-bold text-gray-900 dark:text-white">
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
							<div className=" mb-6">
								<div
									className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black border border-gray-200 dark:border-gray-700`}
								>
									{step.icon}
								</div>
								<div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white shadow-md">
									{index + 1}
								</div>
							</div>
							<h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
								{step.title}
							</h3>
							<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
					className="rounded-2xl bg-white/60 dark:bg-gray-800/60 p-8 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
				>
					<h3 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
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
								className="flex items-center gap-4 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black border border-gray-200 dark:border-gray-700">
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
