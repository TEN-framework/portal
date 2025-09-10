"use client";

import { Calendar, ExternalLink } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HackathonHero({ className }: { className?: string }) {
	const t = useTranslations("hackathon");
	const [mounted, setMounted] = useState(false);
	const { scrollY } = useScroll();
	const y = useTransform(scrollY, [0, 300], [0, -100]);
	const opacity = useTransform(scrollY, [0, 300], [1, 0]);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div
			className={cn(
				"relative z-10 flex h-[calc(100vh-56px)] w-full items-center justify-center overflow-hidden bg-white dark:bg-gray-950",
				className,
			)}
		>
			{/* Animated Background Particles */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				{mounted &&
					[...Array(20)].map((_, i) => (
						<motion.div
							// biome-ignore lint/suspicious/noArrayIndexKey: Stable decorative particles that never reorder
							key={`bg-particle-${i}`}
							className="absolute h-2 w-2 rounded-full bg-orange-500/20"
							initial={{
								x:
									Math.random() *
									(typeof window !== "undefined" ? window.innerWidth : 1200),
								y:
									Math.random() *
									(typeof window !== "undefined" ? window.innerHeight : 800),
							}}
							animate={{
								x:
									Math.random() *
									(typeof window !== "undefined" ? window.innerWidth : 1200),
								y:
									Math.random() *
									(typeof window !== "undefined" ? window.innerHeight : 800),
							}}
							transition={{
								duration: Math.random() * 10 + 10,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							}}
						/>
					))}
			</div>

			<motion.div
				className="container mx-auto max-w-[72rem] px-6"
				style={{ y, opacity }}
			>
				<div className="flex flex-col items-center text-center">
					{/* Badge */}
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.8 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{
							duration: 0.6,
							type: "spring",
							stiffness: 100,
						}}
						className="mb-6"
					/>

					{/* Main Title */}
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.8,
							type: "spring",
							stiffness: 50,
							delay: 0.2,
						}}
						className="mb-4 font-bold text-6xl text-gray-900 tracking-tight md:text-7xl dark:text-white"
					>
						{t("title")}
					</motion.h1>

					{/* Subtitle */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.4,
							type: "spring",
							stiffness: 100,
						}}
						className="mb-6 max-w-3xl font-medium text-gray-600 text-lg md:text-xl dark:text-gray-400"
					>
						{t("subtitle")}
					</motion.p>

					{/* Key Features */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.8,
							type: "spring",
							stiffness: 100,
						}}
						className="mb-8 flex flex-wrap items-center justify-center gap-8 font-medium text-base"
					>
						{[
							{ text: "USD 11,000 Prize Pool", icon: "💰" },
							{ text: "Global & Online", icon: "🌍" },
							{ text: "Open to All", icon: "🚀" },
						].map((feature, index) => (
							<motion.div
								key={feature.text}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{
									duration: 0.5,
									delay: 0.8 + index * 0.1,
									type: "spring",
									stiffness: 200,
								}}
								whileHover={{
									scale: 1.05,
									y: -5,
								}}
								className="flex items-center gap-2 text-black dark:text-white"
							>
								<span className="text-lg">{feature.icon}</span>
								<span>{feature.text}</span>
							</motion.div>
						))}
					</motion.div>

					{/* CTA Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 1.0,
							type: "spring",
							stiffness: 100,
						}}
						className="mb-8 flex flex-col gap-4 sm:flex-row"
					>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={{ type: "spring", stiffness: 300 }}
						>
							<Button
								asChild
								size="lg"
								className="gap-2 bg-black px-8 py-4 font-medium text-lg text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200 cursor-pointer"
							>
								<a
									href="https://luma.com/y14vmjsu"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2"
								>
									{t("cta.register")}
									<ExternalLink className="h-4 w-4" />
								</a>
							</Button>
						</motion.div>

						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={{ type: "spring", stiffness: 300 }}
						>
							<Button
								size="lg"
								variant="outline"
								className="gap-2 border-gray-900 px-8 py-4 font-medium text-gray-900 text-lg hover:bg-gray-100 dark:border-gray-200 dark:text-gray-900 dark:hover:bg-gray-100"
								asChild
							>
								<a
									href="https://discord.gg/8AJkU7cU"
									target="_blank"
									rel="noopener noreferrer"
								>
									{t("cta.joinDiscord")}
									<ExternalLink className="h-4 w-4" />
								</a>
							</Button>
						</motion.div>
					</motion.div>

					{/* Timeline Badge */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 1.2,
							type: "spring",
							stiffness: 100,
						}}
						whileHover={{
							scale: 1.05,
							y: -5,
						}}
						className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2 font-medium text-gray-600 text-sm dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-400"
					>
						<Calendar className="h-4 w-4" />
						<span>Sept 10 - Sept 28 2025</span>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}
