export const blogCategories = [
  'releases',
  'tutorials',
  'community',
  'events'
] as const

export type BlogCategory = (typeof blogCategories)[number]
