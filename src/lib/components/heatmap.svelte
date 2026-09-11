<script lang="ts">
    // GitHub-style contribution heatmap, local — data keyed by YYYY-MM-DD.
    // Cells tint with the site accent; empty cells use a faint muted wash.

    let { data, year = new Date().getFullYear() }: {
        data: Record<string, number>;
        year?: number;
    } = $props();

    const getLastMonday = (start: Date): Date => {
        const date = new Date(start);
        date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
        return date;
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
    // Five steps regardless of how lopsided the distribution is.
    const thresholds = (values: number[]): number[] => {
        const sorted = values.filter((val) => val > 0).sort((va, vb) => va - vb);
        if (sorted.length === 0) {return [1, 2, 3, 4];}
        const quartile = (px: number) => sorted[Math.min(sorted.length - 1, Math.floor(px * sorted.length))];
        return [quartile(0.25), quartile(0.5), quartile(0.75), sorted[sorted.length - 1]];
    };

    const levelFor = (value: number, [t1, t2, t3, t4]: number[]): number => {
        if (value <= 0) {return 0;}
        if (value <= t1) {return 1;}
        if (value <= t2) {return 2;}
        if (value <= t3) {return 3;}
        return 4;
    };

    const buildCalendar = (yr: number): { calendar: Day[][] } => {
        const base = getLastMonday(new Date(yr, 0, 1));

        const raw: Day[][] = Array.from({ length: 7 }, (_, idx) => {
            const start = new Date(base);
            start.setDate(base.getDate() + idx);
            return Array.from({ length: 53 }, (__, idx2) => {
                const day = new Date(start);
                day.setDate(start.getDate() + idx2 * 7);
                if (day.getFullYear() !== yr) {return undefined;}
                const [date] = day.toISOString().split('T');
                return { date, level: 0, value: data[date] ?? 0 };
            });
        });

        const levels = thresholds(raw.flat().map((th) => th?.value ?? 0));
        for (const day of raw.flat()) {
            if (day) {day.level = levelFor(day.value, levels);}
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
