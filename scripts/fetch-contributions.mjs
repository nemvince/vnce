// Fetches GitHub contribution counts for a user and writes them as a
// YYYY-MM-DD → count map. Counts live in tooltip elements paired to day
// cells by id (GitHub's calendar HTML has no direct count attribute).
// Usage: node scripts/fetch-contributions.mjs [user] [out.json]
import { writeFileSync } from 'node:fs';

const user = process.argv[2] ?? 'nemvince';
const out = process.argv[3] ?? 'src/lib/assets/contributions.json';

const html = await (
    fetch(`https://github.com/users/${user}/contributions`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    }).then((r) => {
        if (!r.ok) throw new Error(`GitHub returned ${r.status}`);
        return r.text();
    })
);

// day cells: <td ... data-date="2025-09-07" id="contribution-day-component-0-0" ...>
// tooltips:   <tool-tip for="contribution-day-component-0-0">20 contributions on ...</tool-tip>
const dateById = new Map();
for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-[\d-]+)"/g)) {
    dateById.set(m[2], m[1]);
}

const data = {};
for (const m of html.matchAll(/for="(contribution-day-component-[\d-]+)"[^>]*>([\d,]+) contribution/g)) {
    const date = dateById.get(m[1]);
    if (date) data[date] = parseInt(m[2].replace(/,/g, ''), 10);
}

const total = Object.values(data).reduce((a, b) => a + b, 0);
writeFileSync(out, JSON.stringify(data, null, 0) + '\n');
console.log(`${Object.keys(data).length} days, ${total} contributions → ${out}`);
