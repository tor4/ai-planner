How every interactive component responds: hover, pressed, focused, selected and disabled. The preview forces each state with an `is-*` class; in the app the real pseudo-classes apply.

- **Hover:** ink buttons lighten to `action-hover`; citron fills go to `citron-hover`; secondary, icon and ghost buttons, nav items, tabs, rows and link rows get a `wash` background and secondary borders turn `ink`. Blocks get a 2px `line` outline. Inputs get an `ink` border.
- **Pressed (`:active`):** `action-press`, `citron-press` or `wash-strong`, and buttons and blocks move down 1px.
- **Focused (`:focus-visible`):** always the 3px solid `focus` ring with a 2px offset, on top of any other state. Inputs also turn their border `ink`. Never remove it.
- **Selected:** current nav item is an ink pill, current tab and rail item a citron pill, the selected task row `citron-tint`, a selected block a 3px `ink` outline (`aria-selected="true"`). Selection always has an ARIA attribute, never colour alone.
- **Disabled:** 50% opacity, `not-allowed` cursor and no hover change. Keep disabled controls visible (offline, every data-changing action).
- Transitions are 120ms and are switched off under reduced motion.
- `is-hover`, `is-active`, `is-focus`, `is-selected`, `is-disabled` exist only for docs and previews. Do not use them to fake state in the app.
