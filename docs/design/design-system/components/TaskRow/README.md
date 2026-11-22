One task in the Tasks list: done checkbox, title, a mono meta line, and a ⋯ menu.

- The consumer provides the title and the meta: estimate, flags as `aip-tag` (Urgent, Important), deadline or next block, and a Missed chip when one of its blocks is missed.
- The selected task (details open beside it) gets `aria-current="true"` and a `citron-tint` background.
- The checkbox's accessible name is "Mark <title> done"; the menu's is "More for <title>". Not now, Delete and Earlier versions live in that menu.
- Rows are at least 64px tall; the checkbox and menu are separate 44px targets.
