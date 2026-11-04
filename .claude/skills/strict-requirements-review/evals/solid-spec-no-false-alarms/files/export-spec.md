# Spec: CSV export of invoices

Owner: Billing team (lead: R. Okafor). Version 1.2. Status: in review. Last updated 2026-10-20.

## Problem
Finance admins re-type invoice data into their accounting tools. In the October survey, 64 of 90 admins (71%) said they copy invoices by hand at least once a week; support received 212 tickets about it in Q3.

## Goal and success metric
Admins can export invoices to CSV themselves.
- Metric: share of active admin accounts that export at least once in 30 days. Baseline 0% (feature does not exist). Target 40% within 90 days of release, measured from the `invoice_export_completed` event.
- Guardrail: invoice-related support tickets must not rise above the Q3 level (212 per quarter).

## User
Finance admin with the "Billing admin" role. Other roles cannot see the export button.

## Requirements and acceptance criteria
1. **Export button on the invoice list.**
   - Given a billing admin on the invoice list, when they click "Export CSV", then a CSV of the invoices matching the current filters downloads.
   - Given a user without the Billing admin role, then the button is not shown, and a direct request to the export endpoint returns HTTP 403.
2. **File format.**
   - UTF-8 with a byte-order mark (so Excel detects the encoding) and a header row. Columns, in order: invoice_number, issue_date (YYYY-MM-DD), customer_name, currency (ISO 4217), net_amount, tax_amount, total_amount, status.
   - Amounts use a dot as the decimal separator and the currency's ISO 4217 minor units (for example 2 for EUR, 0 for JPY, 3 for BHD). Values containing commas or quotes are quoted per RFC 4180.
   - Text values that start with `=`, `+`, `-` or `@` are prefixed with a single quote, so spreadsheet apps don't run them as formulas.
3. **Size limit.**
   - Given a filter matching up to 10,000 invoices, then the file downloads within 10 seconds (p95).
   - Given more than 10,000 invoices, then the app shows "Narrow your filters to 10,000 invoices or fewer" and exports nothing.
4. **Empty result.**
   - Given a filter matching no invoices, then the button is disabled with the tooltip "No invoices to export".

## Non-goals
- Scheduled or emailed exports (low demand in the survey: 6 of 90).
- Formats other than CSV (Excel opens CSV; revisit if tickets ask for XLSX).
- Exporting line items (separate spec, planned for Q2).

## Dependencies
- The invoice list API already supports the filters (owner: Platform team, confirmed 2026-10-14).

## Open questions
- Should the file name include the filter range? Owner: R. Okafor, decide by 2026-11-20.
