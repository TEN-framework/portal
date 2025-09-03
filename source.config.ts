import {
	defineDocs,
	defineConfig,
	defineCollections,
} from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
	dir: "content/docs",
});

export default defineConfig({
	mdxOptions: {
		// MDX options
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
