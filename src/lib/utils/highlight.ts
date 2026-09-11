import { createHighlighter, type Highlighter } from 'shiki'

// Singleton promise so concurrent post imports share one highlighter instance.
let highlighterPromise: Promise<Highlighter> | undefined = undefined

const getHighlighter = () => {
  highlighterPromise ??= createHighlighter({
    langs: ['svelte', 'typescript', 'javascript', 'bash', 'json', 'css', 'html'],
    themes: ['vitesse-light', 'vitesse-dark']
  })
  return highlighterPromise
}

const LANG_ALIASES: Record<string, string> = {
  js: 'javascript',
  sh: 'bash',
  shell: 'bash',
  ts: 'typescript'
}

// Mdsvex highlighter: emits a <pre> with dual-theme CSS vars so one build
// Serves both light and dark mode without re-rendering.
// Filename comes from the fence meta: ```ts src/lib/posts.ts
const FILENAME_RE = /(?:^|\s)file=(?<file>[^\s"]+|"[^"]+")|^\s*(?<bare>[^\s=]+\.[a-z]+)\s*$/i
const parseFilename = (metastring?: string | null): string | undefined => {
  if (!metastring) {
    return undefined
  }
  const match = metastring.match(FILENAME_RE)
  const raw = match?.groups?.file ?? match?.groups?.bare
  return raw ? raw.replace(/^"|"$/g, '') : undefined
}

const wrapWithFilename = (html: string, filename: string | undefined, lines: number): string => {
  if (!filename) {
    return html
  }
  // Inject a header bar between shiki's <pre> open tag and its content.
  const counter = `<span class="code-loc">${lines} ${lines === 1 ? 'line' : 'lines'}</span>`
  return html.replace(
    /(?<open><pre[^>]*>)(?<code><code)/,
    `$<open><div class="code-filename not-typeset"><span>${filename}</span>${counter}</div>$<code>`
  )
}

export const highlighter = async (
  code: string,
  lang?: string | null,
  metastring?: string | null
) => {
  const shiki = await getHighlighter()
  const resolved = LANG_ALIASES[lang ?? ''] ?? lang ?? 'text'
  const filename = parseFilename(metastring)
  const lines = code.replace(/\n$/, '').split('\n').length

  const body = shiki.getLoadedLanguages().includes(resolved)
    ? shiki.codeToHtml(code, {
        lang: resolved,
        themes: { dark: 'vitesse-dark', light: 'vitesse-light' }
      })
    : `<pre class="shiki"><code>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</code></pre>`

  const wrapped = wrapWithFilename(body, filename, lines)
  // Inline as a JS string literal — raw html in {@html …} breaks the svelte
  // Parser because shiki output contains braces.
  const escaped = wrapped
    .replace(/\\/g, String.raw`\\`)
    .replace(/`/g, '\\\`')
    .replace(/\$\{/g, '\\${')
  return `{@html \`${escaped}\`}`
}
