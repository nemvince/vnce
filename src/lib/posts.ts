export type Post = {
    title: string;
    date: string;
    description?: string;
    published: boolean;
    slug: string;
};

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
