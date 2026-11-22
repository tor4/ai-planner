The app's main navigation: `aip-topbar` with `aip-nav` on tablet and desktop, `aip-tabbar` at the bottom on phone (under 640px).

- Top bar: wordmark (the name in `display`, no logo yet), Plan, Tasks, Metrics, then New task (citron) and Account. The current item is an ink pill with `aria-current="page"`.
- Tab bar: Plan, Tasks, Check in, Metrics, More, each a Tabler icon over a `tab` label. The current tab puts its icon in a citron pill and has `aria-current="page"`.
- The Check in count is text ("Check in 2", read as "Check in, 2 blocks"), never an alert badge.
- The tab bar shows on the five top-level screens only; sub-screens show "‹ Back" in the toolbar.
