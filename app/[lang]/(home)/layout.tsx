import { baseOptions } from '@/app/layout.config'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import type { ReactNode } from 'react'

export default async function Layout({
	params,
	children,
}: {
	params: Promise<{ lang: string }>
	children: ReactNode
}) {
	const { lang } = await params

	return (
		<HomeLayout {...baseOptions(lang)} className="pt-0">
			{children}
		</HomeLayout>
	)
}
