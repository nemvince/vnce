import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { GITHUB_TOKEN, CACHE_DIR } from '$env/static/private';
import type { PageServerLoad } from './$types';

const cacheFile = () => `${CACHE_DIR}/contributions-${new Date().getFullYear()}.json`;
const MAX_AGE_MS = 6 * 60 * 60 * 1000; // refetch at most 4x/day

const fetchFromGithub = async (): Promise<Record<string, number>> => {
    const query = `{
        user(login: "nemvince") {
            contributionsCollection {
                contributionCalendar {
                    weeks {
                        contributionDays {
                            date
                            contributionCount
                        }
                    }
                }
            }
        }
    }`;

    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`);

    const json = await res.json();
    const weeks = json.data.user.contributionsCollection.contributionCalendar
        .weeks as { contributionDays: { date: string; contributionCount: number }[] }[];

    const map: Record<string, number> = {};
    for (const week of weeks) {
        for (const day of week.contributionDays) {
            map[day.date] = day.contributionCount;
        }
    }
    return map;
};

const readCache = async (allowStale = false): Promise<Record<string, number> | null> => {
    try {
        if (!allowStale) {
            const s = await stat(cacheFile());
            if (Date.now() - s.mtimeMs > MAX_AGE_MS) return null;
        }
        return JSON.parse(await readFile(cacheFile(), 'utf8'));
    } catch {
        return null;
    }
};

export const load: PageServerLoad = async () => {
    let data = await readCache();

    if (!data) {
        try {
            data = await fetchFromGithub();
            await mkdir(CACHE_DIR, { recursive: true });
            await writeFile(cacheFile(), JSON.stringify(data));
        } catch (e) {
            console.error('contributions fetch failed:', e);
            data = await readCache(true); // serve stale cache if we have any
        }
    }

    return { contributions: data ?? {} };
};
