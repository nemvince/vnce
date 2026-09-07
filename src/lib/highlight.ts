import { createHighlighter, type Highlighter } from 'shiki';

// Singleton promise so concurrent post imports share one highlighter instance.
let highlighterPromise: Promise<Highlighter> | null = null;

const getHighlighter = () => {
    highlighterPromise ??= createHighlighter({
        themes: ['vitesse-light', 'vitesse-dark'],
        langs: ['svelte', 'typescript', 'javascript', 'bash', 'json', 'css', 'html']
    });
    return highlighterPromise;
};

const LANG_ALIASES: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    sh: 'bash',
    shell: 'bash'
};

// mdsvex highlighter: emits a <pre> with dual-theme CSS vars so one build
// serves both light and dark mode without re-rendering.
// Filename comes from the fence meta: ```ts src/lib/posts.ts
const FILENAME_RE = /(?:^|\s)file=([^\s"]+|"[^"]+")|^\s*([^\s=]+\.[a-z]+)\s*$/i;
const parseFilename = (metastring?: string | null): string | null => {
    if (!metastring) return null;
    const m = metastring.match(FILENAME_RE);
    const raw = m?.[1] ?? m?.[2];
    return raw ? raw.replace(/^"|"$/g, '') : null;
};

const wrapWithFilename = (html: string, filename: string | null, lines: number): string => {
    if (!filename) return html;
    // Inject a header bar between shiki's <pre> open tag and its content.
    const counter = `<span class="code-loc">${lines} ${lines === 1 ? 'line' : 'lines'}</span>`;
    return html.replace(
        /(<pre[^>]*>)(<code)/,
        `$1<div class="code-filename not-typeset"><span>${filename}</span>${counter}</div>$2`
    );
};

export const highlighter = async (
    code: string,
    lang?: string | null,
    metastring?: string | null
) => {
    const shiki = await getHighlighter();
    const resolved = LANG_ALIASES[lang ?? ''] ?? lang ?? 'text';
    const filename = parseFilename(metastring);
    const loaded = shiki.getLoadedLanguages();

    if (!loaded.includes(resolved)) {
        const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;');
        const lines = code.replace(/\n$/, '').split('\n').length;
        const fallback = wrapWithFilename(
            `<pre class="shiki"><code>${escaped}</code></pre>`,
            filename,
            lines
        );
        return `{@html \`${fallback.replace(/\\/g, '\\\\').replace(/\`/g, '\\\`').replace(/\$\{/g, '\\${')}\`}`;
    }

    const lines = code.replace(/\n$/, '').split('\n').length;
    const html = shiki.codeToHtml(code, {
        lang: resolved,
        themes: { light: 'vitesse-light', dark: 'vitesse-dark' }
    });
    // Inline as a JS string literal — raw html in {@html …} breaks the svelte
    // parser because shiki output contains braces.
    const wrapped = wrapWithFilename(html, filename, lines);
    return `{@html \`${wrapped.replace(/\\/g, '\\\\').replace(/\`/g, '\\\`').replace(/\$\{/g, '\\${')}\`}`;
};
