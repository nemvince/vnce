export interface Post {
  title: string
  date: string
  description?: string
  published: boolean
  slug: string
}

export const getPosts = (): Post[] => {
  const files = import.meta.glob('/src/posts/*.md', { eager: true })
  const posts: Post[] = []

  for (const [path, file] of Object.entries(files)) {
    const slug = path.split('/').pop()?.replace('.md', '')
    if (file && typeof file === 'object' && 'metadata' in file && slug) {
      const meta = file.metadata as Omit<Post, 'slug'>
      if (meta.published) {
        posts.push({ ...meta, slug })
      }
    }
  }

  return posts.sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
}
