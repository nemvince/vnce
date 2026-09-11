<script lang="ts">
    // GitHub-style contribution heatmap, keyed by YYYY-MM-DD, laid out like the github.com profile graph: one column per week, seven weekday rows (Sunday first), month labels above, weekday labels to the left.
    // The grid spans the trailing year of data rather than a calendar year, so it ends on the newest day instead of trailing blank columns.

    let { data }: { data: Record<string, number> } = $props();

    // 5-step opaque ramp: faint muted wash → full accent
    const CELL_COLORS = [
        'color-mix(in oklab, var(--color-accent) 20%, var(--color-bg))',
        'color-mix(in oklab, var(--color-accent) 40%, var(--color-bg))',
        'color-mix(in oklab, var(--color-accent) 60%, var(--color-bg))',
        'color-mix(in oklab, var(--color-accent) 80%, var(--color-bg))',
        'var(--color-accent)',
    ];
    const EMPTY_COLOR = 'color-mix(in oklab, var(--color-muted) 10%, var(--color-bg))';

    const WEEKDAY_NAMES = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    // GitHub prints Mon/Wed/Fri only; the rest stay in the tree as sr-only.
    const WEEKDAYS_LABELLED = new Set([1, 3, 5]);
    const MONTH_NAMES = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const MS_PER_DAY = 86_400_000;

    interface Day {
        date: string;
        value: number;
        level: number;
    }
    interface Grid {
        rows: (Day | undefined)[][];
        months: (string | undefined)[];
    }
    interface Range {
        start: Date;
        end: Date;
        weeks: number;
    }

    const pad = (value: number): string => String(value).padStart(2, '0');
    // Local date parts: toISOString() would shift the day west of UTC.
    const toISODate = (date: Date): string =>
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    // Calendar-day steps, so DST never lands a cell on the wrong day.
    const addDays = (date: Date, days: number): Date =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
    const startOfWeek = (date: Date): Date => addDays(date, -date.getDay());
    const fromISODate = (iso: string): Date => {
        const [year, month, day] = iso.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    // Quartile thresholds over nonzero days, so the ramp always uses all five steps regardless of how lopsided the distribution is.
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

    // First and last day of the graph, snapped to whole weeks from the newest datum back.
    const rangeOf = (dates: string[]): Range => {
        const start = startOfWeek(fromISODate(dates[0]));
        const end = fromISODate(dates[dates.length - 1]);
        const weeks = Math.round((Number(startOfWeek(end)) - Number(start)) / MS_PER_DAY / 7) + 1;
        return { end, start, weeks };
    };

    // Days past the newest datum are the blanks that end the graph.
    const cellAt = (date: Date, end: Date, counts: Record<string, number>): Day | undefined =>
        date > end ? undefined : { date: toISODate(date), level: 0, value: counts[toISODate(date)] ?? 0 };

    const buildRows = (range: Range, counts: Record<string, number>): (Day | undefined)[][] =>
        Array.from({ length: WEEKDAY_NAMES.length }, (_, weekday) =>
            Array.from({ length: range.weeks }, (__, week) =>
                cellAt(addDays(range.start, week * 7 + weekday), range.end, counts)
            )
        );

    // Names one column per week for the month that column opens.
    // The trailing partial week stays unlabelled, as github.com does.
    const buildMonths = (range: Range): (string | undefined)[] =>
        Array.from({ length: range.weeks }, (_, week) => {
            const month = addDays(range.start, week * 7).getMonth();
            const opens = week === 0 || month !== addDays(range.start, (week - 1) * 7).getMonth();
            if (!opens || (range.end.getDay() < 6 && week === range.weeks - 1)) {return undefined;}
            return MONTH_NAMES[month];
        });

    const buildGrid = (counts: Record<string, number>): Grid => {
        const dates = Object.keys(counts).sort();
        if (dates.length === 0) {return { months: [], rows: [] };}

        const range = rangeOf(dates);
        const rows = buildRows(range, counts);
        const levels = thresholds(rows.flat().map((day) => day?.value ?? 0));
        for (const day of rows.flat()) {
            if (day) {day.level = levelFor(day.value, levels);}
        }
        return { months: buildMonths(range), rows };
    };

    const grid = $derived(buildGrid(data));
</script>

{#if grid.rows.length > 0}
    <table class="heatmap not-typeset" aria-label="GitHub contributions">
        <thead>
            <tr class="months">
                <td class="gutter"><span class="sr-only">Day of the week</span></td>
                {#each grid.months as month, week (week)}
                    <td class="month">
                        {#if month}<span aria-hidden="true">{month}</span>{/if}
                    </td>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each grid.rows as days, weekday (WEEKDAY_NAMES[weekday])}
                <tr>
                    <td class="gutter">
                        <span class="sr-only">{WEEKDAY_NAMES[weekday]}</span>
                        {#if WEEKDAYS_LABELLED.has(weekday)}<span aria-hidden="true"
                                >{WEEKDAY_NAMES[weekday].slice(0, 3)}</span
                            >{/if}
                    </td>
                    {#each days as day, week (day?.date ?? week)}
                        {#if day}
                            <td
                                class="cell"
                                style={`background:${CELL_COLORS[day.level]}`}
                                data-date={day.date}
                                data-value={day.value}
                                title="{day.value} contribution{day.value === 1 ? '' : 's'} on {day.date}"
                            ></td>
                        {:else}
                            <td class="cell blank"></td>
                        {/if}
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
{/if}

<style>
    /* Squares scale with the column; github.com fixes them at 10px with the
       same 3px gutters and a 28px label gutter. */
    .heatmap {
        border-collapse: separate;
        border-spacing: 3px;
        table-layout: fixed;
        width: 100%;
    }
    .gutter {
        position: relative;
        width: 28px;
    }
    .gutter > span[aria-hidden] {
        position: absolute;
        bottom: -1px;
        left: 0;
        color: var(--color-muted);
        font-size: 0.65rem;
        line-height: 1;
        white-space: nowrap;
    }
    .months {
        height: 14px;
    }
    .month {
        position: relative;
    }
    .month > span {
        position: absolute;
        top: 0;
        left: 0;
        color: var(--color-muted);
        font-size: 0.7rem;
        line-height: 1;
        white-space: nowrap;
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
    .cell.blank {
        visibility: hidden;
    }
    .cell:hover {
        filter: brightness(1.3);
    }
    /* A year of columns is unreadable on a phone, so narrow viewports drop the
       oldest weeks and keep the most recent ones. Cells survive only while
       every matching block keeps them, so the tightest range wins. */
    @media (max-width: 671px) {
        .heatmap tr > td:not(:first-child):not(:nth-last-child(-n + 39)) {
            display: none;
        }
    }
    @media (max-width: 599px) {
        .heatmap tr > td:not(:first-child):not(:nth-last-child(-n + 32)) {
            display: none;
        }
    }
    @media (max-width: 519px) {
        .heatmap tr > td:not(:first-child):not(:nth-last-child(-n + 30)) {
            display: none;
        }
    }
    @media (max-width: 479px) {
        .heatmap tr > td:not(:first-child):not(:nth-last-child(-n + 24)) {
            display: none;
        }
    }
    @media (max-width: 429px) {
        .heatmap tr > td:not(:first-child):not(:nth-last-child(-n + 21)) {
            display: none;
        }
    }
    @media (max-width: 379px) {
        .heatmap tr > td:not(:first-child):not(:nth-last-child(-n + 19)) {
            display: none;
        }
    }
    @media (max-width: 339px) {
        .heatmap tr > td:not(:first-child):not(:nth-last-child(-n + 16)) {
            display: none;
        }
    }
</style>
