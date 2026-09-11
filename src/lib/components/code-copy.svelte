<script lang="ts">
    import { onMount } from 'svelte';

    let { host }: { host?: HTMLElement } = $props();

    let ready = $state(false);
    onMount(() => (ready = true));

    const COPY_ICON =
        '<svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M216,32H88a8,8,0,0,0-8,8V72H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H176a8,8,0,0,0,8-8V184h32a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM168,208H48V88H168Zm40-40H184V80a8,8,0,0,0-8-8H96V48H208Z"/></svg>';

    const copyCode = async (btn: HTMLButtonElement, pre: Element) => {
        await navigator.clipboard.writeText(pre.textContent ?? '');
        btn.classList.add('copied');
        btn.setAttribute('aria-label', 'copied');
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.setAttribute('aria-label', 'copy code');
        }, 1500);
    };

    const createCopyButton = (pre: Element): HTMLButtonElement => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'code-copy';
        btn.setAttribute('aria-label', 'copy code');
        btn.innerHTML = COPY_ICON;
        btn.addEventListener('click', () => copyCode(btn, pre));
        return btn;
    };

    // Line numbers via CSS counters, unselectable — only worth it when
    // There are enough lines to count.
    const applyLineNumbers = (el: HTMLElement) => {
        const lineCount = el.querySelectorAll('.line').length;
        if (lineCount < 10) {return;}
        el.style.setProperty('--line-count', String(lineCount));
        el.classList.add('numbered');
    };

    const enhance = (el: HTMLElement) => {
        el.classList.add('enhanced');
        applyLineNumbers(el);

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block not-typeset';
        el.replaceWith(wrapper);
        wrapper.append(el, createCopyButton(el));
    };

    $effect(() => {
        // Re-run when host changes or content hydrates; poll briefly for the
        // Article's dynamic {@html} pre blocks to exist.
        if (!ready || !host) {return;}
        const root = host;
        let tries = 0;
        let timer: ReturnType<typeof setInterval> | undefined = undefined;
        const attempt = () => {
            const pres = root.querySelectorAll('pre.shiki:not(.enhanced)');
            if (pres.length === 0 && ++tries < 20) {return;} // Retry
            clearInterval(timer);
            for (const pre of pres) {
                enhance(pre as HTMLElement);
            }
        };
        timer = setInterval(attempt, 100);
        return () => clearInterval(timer);
    });
</script>
