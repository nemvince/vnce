---
title: hello, world
date: 2026-09-07
description: the first post — why this site exists and what i plan to write about.
published: true
---

this is the first post on my site. i've wanted a place to write things down for
a while — stuff i figure out at 2am and then forget how i did three months later.

## what to expect

mostly technical notes. for example, the load function that powers this very blog index:

```ts src/lib/posts.ts
export const getPosts = (): Post[] => {
    const files = import.meta.glob('/src/posts/*.md', { eager: true });
    const posts: Post[] = [];

    for (const path in files) {
        const file = files[path];
        const slug = path.split('/').pop()?.replace('.md', '');
        if (file && typeof file === 'object' && 'metadata' in file && slug) {
            const meta = file.metadata as Omit<Post, 'slug'>;
            if (meta.published) {
                posts.push({ ...meta, slug });
            }
        }
    }

    return posts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
};
```

and a shell one, because setting this up was literally just:

```sh
bun add -d shiki
```

the plan is to write about:

- how the petriktv kiosk pulls live data from BKK's GTFS feed
- things i break in my proxmox home lab and how i fix them
- lessons from competitions like szeresd a pingvint

## why no comments

no backend, no tracking, no cookie banners. if you want to respond, my email is
one click away on the front page. honestly this is closer to how the old web
felt, and i like it.

more soon.
