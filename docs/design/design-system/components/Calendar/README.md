The day, 3-day and week planner grid: a mono hour gutter, one column per day, and blocks placed by start and length.

- Set `--days` (1, 3 or 7) and `--hours` (rows shown) on `aip-cal`. Each hour is `hour` tall (56px).
- The consumer provides one `aip-cal-day` header per day (today gets `aria-current="date"`, which puts its date in a citron pill), one gutter of hour labels, and one `aip-cal-col` per day.
- Place each `aip-block` inside its column with `--s` (start, in hours from the first row) and `--d` (length in hours). A 15-minute block is `--d:0.25`.
- Blocks under an hour add `aip-block--short`, which puts the time on the title line.
- `aip-cal-off` with `--s`/`--d` shades time outside the template in `paper-sunken`.
- The now marker is a 2px `ink` rule with a dot (`aip-cal-now` in today's column) plus a citron time pill in the gutter (`aip-cal-nowlabel`). Citron is never the line itself: it is too light on paper.
- Blocks are also a list in time order for screen readers; every drag has a keyboard and form alternative (user flows).
