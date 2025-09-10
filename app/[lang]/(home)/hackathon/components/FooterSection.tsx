"use client";

import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/logo";
import { Link } from "@/lib/next-intl-navigation";
import { cn } from "@/lib/utils";

export function FooterSection({ className }: { className?: string }) {
	const t = useTranslations("hackathon");

	const socialLinks = [
		{
			name: "X (Twitter)",
			href: "https://twitter.com/TENFramework",
			icon: "𝕏",
		},
		{
			name: "Medium",
			href: "https://ten-framework.medium.com",
			icon: "M",
		},
	];

	return (
		<section
			className={cn(
				"border-gray-200 border-t bg-gray-50 py-16 dark:border-gray-800 dark:bg-gray-900",
				className,
			)}
		>
			<div className="container mx-auto max-w-[72rem] px-6">
				{/* Main Content */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
				>
					{/* Organizer */}
					<div className="space-y-4">
						<h3 className="font-semibold text-gray-900 text-lg dark:text-white">
							{t("footer.organizer")}
						</h3>
						<Link href="/" className="inline-block">
							<Logo height={40} width={80} />
						</Link>
					</div>

					{/* Partners */}
					<div className="space-y-4">
						<h3 className="font-semibold text-gray-900 text-lg dark:text-white">
							{t("footer.partners")}
						</h3>
						<div className="flex flex-wrap gap-3 text-gray-600 dark:text-gray-400">
							<Link
								href="https://github.com/ten-framework/ten-framework"
								className="inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-1 text-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
								title="TEN Framework"
							>
								TEN Framework
								<ExternalLink className="h-3 w-3" />
							</Link>
							<Link
								href="https://www.agora.io/"
								target="_blank"
								className="inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-1 text-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
								title="Agora"
							>
								Agora
								<ExternalLink className="h-3 w-3" />
							</Link>
							<Link
								href="https://kiro.dev"
								target="_blank"
								className="inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-1 text-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
								title="Kiro"
							>
								Kiro
								<ExternalLink className="h-3 w-3" />
							</Link>
							<Link
								href="https://www.siliconflow.com/"
								target="_blank"
								className="inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-1 text-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
								title="SiliconFlow"
							>
								SiliconFlow
								<ExternalLink className="h-3 w-3" />
							</Link>
						</div>
					</div>

					{/* Community Support */}
					<div className="space-y-4">
						<h3 className="font-semibold text-gray-900 text-lg dark:text-white">
							{t("footer.communitySupport")}
						</h3>
						<div className="flex flex-wrap items-center gap-3 text-gray-600 dark:text-gray-400">
							<span>CamelAI</span>
							<span className="text-gray-400">|</span>
							<span>WayToAGI</span>
							<span className="text-gray-400">|</span>
							<span>IVS</span>
							<span className="text-gray-400">|</span>
							Slush
							<span className="text-gray-400">|</span>
							<span>MeltingHack</span>
						</div>
					</div>

					{/* Social Media */}
					<div className="space-y-4">
						<h3 className="font-semibold text-gray-900 text-lg dark:text-white">
							{t("footer.socialMedia")}
						</h3>
						<div className="flex gap-4">
							{socialLinks.map((social) => (
								<Link
									key={social.name}
									href={social.href}
									target="_blank"
									className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
									title={social.name}
								>
									<span className="font-bold text-lg">{social.icon}</span>
								</Link>
							))}
						</div>
					</div>
				</motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="my-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"
        ></motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            {/* <WelcomeHackers /> */}
          </div>

					<div className="flex items-center gap-6" />
				</motion.div>
			</div>
		</section>
	);
}
