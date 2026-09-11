---
title: hello, world
date: 2026-09-07
description: the first post
published: true
---

more blogs soon, can't be bothered with writing right now. look at this sick code highlighting i implemented

```ts vite.config.ts
import adapter from '@sveltejs/adapter-node'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { mdsvex } from 'mdsvex'
import { defineConfig } from 'vite'
import { highlighter } from './src/lib/utils/highlight.ts'

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      // Adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
      // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
      // See https://svelte.dev/docs/kit/adapters for more information about adapters.
      adapter: adapter(),
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true
      },
      extensions: ['.svelte', '.svx', '.md'],
      preprocess: [mdsvex({ extensions: ['.svx', '.md'], highlight: { highlighter } })]
    })
  ]
})
```