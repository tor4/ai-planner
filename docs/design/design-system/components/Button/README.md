Pill-shaped buttons and the segmented control. Native `button` elements; the consumer provides the label.

- `aip-btn` (ink) is the one main action per area: "Plan my tasks", "Save", "Accept 4 proposals".
- `aip-btn--accent` (citron) is reserved for New task and "As planned": the two actions the daily loop turns on. Never more than one citron button in view besides the Check in options.
- `aip-btn--secondary` for everything else. `aip-btn--small` (24px) only for inline actions such as "Use" and "Dismiss".
- `aip-seg` switches views (Day, 3 days, Week). The selected item uses `aria-pressed="true"` and an ink fill, not colour alone.
- Disabled buttons stay visible; offline every action that changes data is disabled.
