Text inputs, selects, checkboxes, the New task capture field and link rows. Use native elements: `input.aip-input`, `select.aip-input`, `label.aip-check > input[type=checkbox]`.

- Every control has a visible `label` (bold `label` style). Inputs are 44px tall on `paper-raised` with a `line` border.
- Hints sit under the field in `ink-muted`; a duration suggestion explains itself and offers "Use".
- Errors: the field gets `aip-field--error` (2px vermilion border) and an `aip-error` line that names the field and suggests a fix, linked by `aria-describedby`. The typed value stays.
- Use native date, time and number inputs with autofill hints (spec U4).
- `aip-capture` is the New task field with a citron add button; focus stays in the field after Enter.
- `aip-linkrow` is a full-width row that opens a sub-screen ("Steps · 1 of 3 ›").
