"use client";

import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { Link } from '@/lib/next-intl-navigation'
import { useTranslations } from 'next-intl'

export function AboutSection({ className }: { className?: string }) {
  const t = useTranslations("hackathon");

	return (
		<section className={cn('bg-gray-50 py-16 dark:bg-gray-900', className)}>
			<div className="container mx-auto max-w-[72rem] px-6">
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
					viewport={{ once: true }}
					className="mx-auto max-w-4xl text-center"
				>
					<h2 className="mb-8 font-medium text-3xl text-gray-900 md:text-4xl dark:text-white">
						{t('about.title')}
					</h2>
					<div className="mx-auto max-w-3xl text-gray-600 text-lg leading-relaxed dark:text-gray-400">
						<p>{t('about.description')}</p>
						<p>{t('about.descriptionTwo')}</p>
						<div className="mt-6">
							<Link
								href="/hackathon/guidelines"
								className="inline-flex items-center font-semibold text-gray-900 hover:text-gray-700 hover:underline dark:text-white dark:hover:text-gray-300"
							>
								TEN DEV Challenge – Participant Guidelines
							</Link>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
