import {
	defineDocs,
	defineConfig,
	defineCollections,
} from "fumadocs-mdx/config";
import { z } from "zod";
import { remarkImage } from "fumadocs-core/mdx-plugins";

export const docs = defineDocs({
	dir: "content/docs",
});

export default defineConfig({
	mdxOptions: {
		// Avoid remote network calls during build (image size fetch)
		remarkPlugins: [
			[
				remarkImage,
				{ external: false, useImport: true, placeholder: "none", publicDir: "public" },
			],
		],
	},
});

// https://fumadocs.vercel.app/blog/make-a-blog
export const blogPosts = defineCollections({
	type: "doc",
	dir: "content/blog",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		author: z.string(),
		date: z.coerce.date(),
	}),
});
