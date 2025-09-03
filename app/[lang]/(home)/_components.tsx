"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import confetti from "canvas-confetti";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/lib/next-intl-navigation";
import {
	URL_TEN_AGENT,
	HUGGING_FACE_SPACE,
	URL_TEN_VAD,
	URL_TEN_TURN_DETECTION,
} from "@/constants";
import { SAMPLE_PROJECTS } from "./sample-projects";

const TITLES = ["titleLowlantency", "titleMultimodal", "titleEdgeCloud"];

const titleVariants = {
	visible: { y: 0, opacity: 1 },
	hidden: (direction: number) => ({
		y: direction > 0 ? -150 : 150,
		opacity: 0,
	}),
};

const createConfetti = (e: React.MouseEvent) => {
	const count = 88;
	const defaults = {
		origin: {
			x: e.clientX / window.innerWidth,
			y: (e.clientY + 50) / window.innerHeight,
		},
		scalar: 0.6,
	};

	function fire(particleRatio: number, opts: confetti.Options = {}) {
		confetti({
			...defaults,
			...opts,
			particleCount: Math.floor(count * particleRatio),
		});
	}

	fire(0.25, {
		spread: 20,
		startVelocity: 20,
	});
	fire(0.2, {
		spread: 35,
		startVelocity: 15,
	});
	fire(0.35, {
		spread: 30,
		decay: 0.91,
		scalar: 0.4,
		startVelocity: 15,
	});
	fire(0.1, {
		spread: 40,
		startVelocity: 10,
		decay: 0.92,
		scalar: 0.8,
	});
	fire(0.1, {
		spread: 40,
		startVelocity: 10,
	});
};

export function ProjectsShowcase(props: { className?: string }) {
	const { className } = props;

	return (
		<div
			className={cn(
				"w-full py-20 bg-gray-50/50 dark:bg-gray-900/50",
				className,
			)}
		>
			<div className="container mx-auto px-4">
				<div className="mb-12 text-center">
					<h2 className="mb-4 text-4xl font-bold tracking-tight text-black">
						From the Community
					</h2>
					<p className="text-black mx-auto max-w-2xl text-lg">
						Discover amazing projects built with TEN Framework
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{SAMPLE_PROJECTS.map((project) => (
						<Link
							key={project.id}
							href={project.href}
							className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
						>
							<div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
								<div className="flex h-full items-center justify-center text-gray-400">
									<div className="text-center">
										<div className="text-sm">Preview</div>
									</div>
								</div>
							</div>

							<div className="p-6">
								<div className="mb-3 flex items-center justify-between">
									<span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
										{project.category}
									</span>
									<span className="text-sm text-gray-500 dark:text-gray-400">
										{project.remixes} Remixes
									</span>
								</div>

								<h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
									{project.title}
								</h3>

								<p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
									{project.description}
								</p>

								<div className="flex items-center gap-2">
									<div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300">
										{project.author.charAt(0).toUpperCase()}
									</div>
									<span className="text-sm text-gray-600 dark:text-gray-400">
										{project.author}
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>

				<div className="mt-12 text-center">
					<Button variant="outline" size="lg" className="gap-2">
						View All Projects
						<ExternalLink className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}

export function Hero(props: { className?: string }) {
	const { className } = props;

	const t = useTranslations("homePage");

	const [titleNumber, setTitleNumber] = React.useState(0);

	React.useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (titleNumber === TITLES.length - 1) {
				setTitleNumber(0);
			} else {
				setTitleNumber(titleNumber + 1);
			}
		}, 2000);
		return () => clearTimeout(timeoutId);
	}, [titleNumber]);

	return (
		<div className={cn("text-foreground w-full", className)}>
			<div className="container mx-auto">
				<div className="flex flex-col items-center justify-center gap-6 md:gap-8 pt-4 pb-10 sm:pb-12 md:pb-16 lg:pt-8 xl:pb-24 2xl:pb-60">
					<div>
						<Button
							variant="secondary"
							size="sm"
							className="gap-2 bg-blue-600/[0.05] text-blue-600 transition-all duration-600 hover:scale-105 hover:bg-blue-600/[0.08] hover:text-blue-500 py-7 sm:py-0"
							asChild
							onClick={(e) => createConfetti(e)}
						>
							<span className="flex items-center gap-2">
								🎉{" "}
								<Link
									href={URL_TEN_VAD}
									className="font-medium text-blue-500 dark:text-blue-300 text-sm sm:text-base hover:underline underline-offset-2"
								>
									TEN VAD
								</Link>
								<span className="font-medium text-blue-500 dark:text-blue-300 text-sm sm:text-base">
									and
								</span>
								<Link
									href={URL_TEN_TURN_DETECTION}
									className="font-medium text-blue-500 dark:text-blue-300 text-sm sm:text-base hover:underline underline-offset-2"
								>
									TEN Turn Detection
								</Link>
								<span className="font-medium text-blue-500 dark:text-blue-300 text-sm sm:text-base">
									are now part of the TEN open-source ecosystem!
								</span>
							</span>
						</Button>
					</div>
					<div className="flex flex-col gap-4">
						<h1 className="font-regular text-center text-5xl tracking-tighter md:text-6xl lg:text-7xl">
							<span className="text-spektr-cyan-50 font-medium">
								{t("titlePrefix")}
							</span>
							<span className="relative flex w-full justify-center overflow-hidden text-center leading-tight md:leading-normal">
								&nbsp;
								{TITLES.map((title, index) => (
									<motion.span
										key={index}
										className="absolute font-bold"
										initial="hidden"
										animate={titleNumber === index ? "visible" : "hidden"}
										variants={titleVariants}
										custom={titleNumber > index ? 1 : -1}
										transition={{
											type: "spring",
											stiffness: 35,
											duration: 0.5,
										}}
									>
										{t(title)}
									</motion.span>
								))}
							</span>
							<span className="text-spektr-cyan-50 font-medium">
								{t("titleSuffix")}
							</span>
						</h1>

						<p className="text-muted-foreground max-w-2xl text-center text-lg leading-relaxed font-medium tracking-tight md:text-xl dark:text-gray-300">
							{t("heroDescription")}
						</p>
					</div>
					<div className="flex flex-col sm:flex-row gap-3">
						<Button size="lg" className="gap-4" asChild>
							<Link href={URL_TEN_AGENT} target="_blank">
								{t("heroBtnTryTenAgent")}
								<ExternalLink className="size-4" />
							</Link>
						</Button>
						<Button size="lg" className="gap-4" variant="outline" asChild>
							<Link href={HUGGING_FACE_SPACE} target="_blank">
								{t("huggingFaceSpace")}
								<ExternalLink className="size-4" />
							</Link>
						</Button>
					</div>
					<p className="text-muted-foreground/100 max-w-2xl text-center text-sm leading-relaxed font-normal tracking-tight md:text-base dark:text-gray-300">
						{t("supportedBy")}{" "}
						<Link
							href="https://www.agora.io/en/"
							target="_blank"
							className="text-spektr-cyan-100 underline decoration-gray-300 underline-offset-5 hover:text-[] hover:decoration-[#13C2FF]"
						>
							Agora
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
