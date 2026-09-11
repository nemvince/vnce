import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

// Static import cannot work here: the module path is user-selected at request
// Time (one .md file per slug). Vite's glob-based dynamic import is the
// Documented mdsvex pattern; the template literal is constrained to
// ../../../posts/*.md at build time.
export const load: PageLoad = async ({ params }) => {
  try {
    const post = await import(`../../../posts/${params.slug}.md`)
    return {
      content: post.default,
      meta: post.metadata as { title: string; date: string }
    }
  } catch {
    error(404, 'post not found')
  }
}
