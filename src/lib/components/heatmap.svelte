<script lang="ts">
    // GitHub-style contribution heatmap, local — data keyed by YYYY-MM-DD.
    // Cells tint with the site accent; empty cells use a faint muted wash.

    let { data, year = new Date().getFullYear() }: {
        data: Record<string, number>;
        year?: number;
    } = $props();

    const getLastMonday = (start: Date): Date => {
        const d = new Date(start);
        d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
        return d;
    };

    // 5-step opaque ramp: faint muted wash → full accent
    const CELL_COLORS = [
        'color-mix(in oklab, var(--color-accent) 20%, var(--color-bg))',
        'color-mix(in oklab, var(--color-accent) 40%, var(--color-bg))',
        'color-mix(in oklab, var(--color-accent) 60%, var(--color-bg))',
        'color-mix(in oklab, var(--color-accent) 80%, var(--color-bg))',
        'var(--color-accent)',
    ];
    const EMPTY_COLOR = 'color-mix(in oklab, var(--color-muted) 10%, var(--color-bg))';

    type Day = { date: string; value: number; level: number } | undefined;

    // Quartile thresholds over nonzero days, so the ramp always uses all
    // five steps regardless of how lopsided the distribution is.
    const thresholds = (values: number[]): number[] => {
        const sorted = values.filter((v) => v > 0).sort((a, b) => a - b);
        if (sorted.length === 0) return [1, 2, 3, 4];
        const q = (p: number) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
        return [q(0.25), q(0.5), q(0.75), sorted[sorted.length - 1]];
    };

    const levelFor = (value: number, [t1, t2, t3, t4]: number[]): number =>
        value <= 0 ? 0 : value <= t1 ? 1 : value <= t2 ? 2 : value <= t3 ? 3 : 4;

    const buildCalendar = (year: number): { calendar: Day[][] } => {
        const base = getLastMonday(new Date(year, 0, 1));

        const raw: Day[][] = Array.from({ length: 7 }, (_, i) => {
            const start = new Date(base);
            start.setDate(base.getDate() + i);
            return Array.from({ length: 53 }, (_, j) => {
                const day = new Date(start);
                day.setDate(start.getDate() + j * 7);
                if (day.getFullYear() !== year) return undefined;
                const date = day.toISOString().split('T')[0];
                return { date, value: data[date] ?? 0, level: 0 };
            });
        });

        const levels = thresholds(raw.flat().map((d) => d?.value ?? 0));
        for (const day of raw.flat()) {
            if (day) day.level = levelFor(day.value, levels);
        }
        return { calendar: raw };
    };

    const { calendar } = $derived(buildCalendar(year));
</script>

<table class="heatmap not-typeset" aria-label="GitHub contributions">
    <tbody>
        {#each calendar as week, i (i)}
            <tr>
                {#each week as day, j (day?.date ?? `w${i}d${j}`)}
                    {#if day}
                        <td
                            class="cell"
                            style={`background:${CELL_COLORS[day.level]}`}
                            data-date={day.date}
                            data-value={day.value}
                            title="{day.value} contribution{day.value === 1 ? '' : 's'} on {day.date}"
                        ></td>
                    {:else}
                        <td class="cell empty"></td>
                    {/if}
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    .heatmap {
        border-collapse: separate;
        border-spacing: 3px;
        width: 100%;
        table-layout: fixed;
    }
    .cell {
        border-radius: 2px;
        transition: background-color 0.1s;
    }
    /* table cells ignore aspect-ratio; fake it with a square padding filler */
    .cell::before {
        content: '';
        display: block;
        padding-top: 100%;
    }
    .cell.empty {
        visibility: hidden;
        border: none;
    }
    .cell:hover {
        filter: brightness(1.3);
    }
</style>
