---
title: "AI Planner PRD"
working_title: "AI Planner"
owner: Nataly
version: 0.1
date: 2026-11-04
status: approved
approved_on: 2026-11-04
---

# Product Requirements Document: AI Planner

The product name is undecided; see "Open questions".

## 1. Problem and vision
Many people have more to do than they can keep track of, and they procrastinate. Tasks that stay on a to-do list get postponed again and again. Giving a task a specific time on a visual calendar is expected to help. Research on specific "when and where" plans (implementation intentions) is well supported; the evidence for time blocking itself is weaker (see `docs/research/2026-10-30-evidence-base.md`). This product bets on the first and treats the second as a hypothesis that the owner's own data will inform (see the week-12 decision review in section 3). Today planning is manual work, and the plan has no memory: nobody records how it really went, so the next plan repeats the same optimistic errors.

AI Planner helps people turn everything they have to do into a visual plan for the day, week, month and year, so tasks get done instead of postponed. It records what actually happened, and uses each person's own history, plus published research, to make every plan more realistic than the last.

## 2. Users
- **Primary:** the owner, as a personal tool.
- **Later:** other people. The first version is single-user. Every stored record carries a user ID, so multi-user support does not need a data-model rewrite.

## 3. Goals and success metrics
Weeks start on Monday, in the home time zone. The measurement clock starts on the first Monday after Release 1a is in daily use. A week's numbers are final 14 days after the week ends, when the 7-day late-confirmation and edit windows (including the done flag) have closed.

- **Core goal:** tasks get done instead of being postponed again. Everything you need to do ends up as a block with a time on the app's calendar. Planned blocks live only in the app (see section 7).
- **Base goal:** daily use without forcing yourself. Planning and confirming a day takes about 5 minutes or less.

**Reported metrics.** The metrics view (Must 15) shows these numbers weekly. They are inputs to the decision review below, not pass/fail gates, because one person's data is too small for a statistical test.
- **Completion rate:** tasks whose first block was scheduled in the week that were marked done by the end of that same week, divided by all tasks whose first block was scheduled in the week. The cohort week is the week containing the start of the task's first block at the moment it is created, and it is frozen. A task whose blocks span several weeks therefore counts as not done unless it is finished by the end of its cohort week; this is intended. It does not move when the block moves. A task that is postponed, dropped or deleted stays in the denominator as not done. The done time is the end time of the last confirmed block when the task was marked done by confirmation (Must 2), and otherwise the time the user marked it. The done flag can be changed for 7 days after it is set.
- **Postponement rate:** postponed blocks divided by blocks originally scheduled in the week whose start time has passed. Each postponement event counts once, so a block postponed twice counts twice. The count of missed blocks is shown next to it, because a block skipped in silence is not a postponement until the user acts. "Originally scheduled" means the week of the block's start when it was created, frozen. A postponement counts toward that original week.
- **Early-move rate:** blocks moved to a later week before they start, divided by blocks originally scheduled in the week.
- **Scheduled share:** tasks with at least one block divided by tasks created, counted in the week the task was created.
- **Estimate error:** |actual time − planned time| / planned time, where planned time is the block's length. It covers "as planned" and "it took X" blocks, and excludes "partly done" blocks. A block counts in the week of its start time at confirmation. It is shown with the signed overrun, the planned-hours trend and the share of "as planned" confirmations, so that padding and rubber-stamping are visible. A reference level of 20% median error is used for judgment.
- **Confirmation rate:** confirmed blocks divided by blocks whose end time passed more than 7 days ago. The unconfirmed share is shown with it. The learning loop needs about 70% or more.
- **Planning time:** a day's planning time is the sum of its active sessions in the planning view, plus confirmations made that day (including late confirmations of earlier days). Idle gaps longer than 60 seconds without input events are excluded. Active days per week are shown next to it.

**Decision review.** At week 12 the owner reviews the trends and decides to continue, change the approach or stop. Questions to ask:
- Is the completion rate stable and high, or rising compared with the first 4 weeks?
- Is the confirmation rate at least about 70%? If not, fix the confirm flow before anything else, since insights depend on it.
- Is planning time within about 5 minutes a day?
- Are the early-move and postponement rates falling?

If the answers are mostly no, candidate changes are writing blocks to Google Calendar and a lighter confirm flow. There are no fixed thresholds, because the review is a judgment.

**Known limits.** The first 4 weeks are measured with the tool, so they show change after the first weeks of use, not a comparison with life before the tool. A 2-week manual log before starting is optional and recommended. Features delivered during the 12 weeks (Release 1b) change the tool; note the dates in the review.

## 4. How it works
- **Planning at four scales.** Day and week hold detailed time blocks. Month and year start as rough placeholders, such as a vacation in mid-July, with reserved planning slots to add detail later.
- **Plan-then-confirm.** You plan blocks, then confirm what happened (as planned, it took X, partly done, or didn't do it).
- **Adaptation.** The app shows insights from your history and suggests durations while you plan (for example, "this usually takes you 1.6h").
- **LLM-first, planner-complete.** Every Must action can be done in the visual planner without the assistant, so the app works if the LLM is unavailable. This includes slot suggestions, which come from a rule-based suggester. The chat assistant matches the planner's abilities as the Should items are delivered, refines suggestions, and reads your data through tools; it does not guess.
- **Evidence-based advice.** Tips come from a curated, cited list (see `docs/research/2026-10-30-evidence-base.md`), each with an evidence rating. Wellbeing guidance only, never medical advice.

### Glossary
- **Block:** a task, or a part of a task, placed at a specific time on the app's calendar. A task has one or more blocks. A block is at least 15 minutes long and cannot cross midnight.
- **Placeholder:** a rough entry on the month or year view, without a precise time.
- **Planning slot:** a block reserved for adding detail to a placeholder later.
- **Hard event:** an imported Google Calendar event that blocks time (see Must 3).
- **Unconfirmed block:** a block whose end time has passed and has not been confirmed.
- **Missed block:** an unconfirmed block that is 30 minutes past its end time. It triggers the reschedule prompt (see Should, postponement handling).
- **Postponement:** a block whose start time passed and that did not happen on time, meaning it was confirmed "didn't do it", or it was moved to a new time after its start had passed (a missed block that is rescheduled, or any past unconfirmed block that is moved), unless the user confirms it was done at the new time with "it took X". Moving a block before it starts is not a postponement. "Partly done" is not a postponement. A missed block that is never rescheduled stays unconfirmed.
- **Task type:** exactly one per task, chosen from a user-editable list (see Must 6).
- **End of day:** the end of that day's working hours in the availability template, or 21:00 if none is set.
- **Available time:** the template's working hours and focus times, minus hard events, minus existing blocks, minus recovery buffers. Sleep and meals are never available. Given no template is set, there is no available time, and the suggester proposes nothing and prompts the user to set the template.

## 5. Prioritized requirements

### Must
Each item has acceptance criteria. Thresholds are the owner's agreed defaults.

Release stages:
- **Release 1a (the loop):** Musts 1 to 9 and 15, plus Google sign-in, the user ID on every record, instant-plus-zone storage and the edit rules from Must 12, and delete-all from Must 14, because 1a holds personal data and Google tokens. Data is stored on the server under the user's account from the start, so nothing needs migrating when sync arrives. The recording of the events behind the metrics starts in 1a. Tasks carry a frozen first-block week, and blocks carry a frozen original start time, as stored fields, so the metrics can be rebuilt without the edit history.
- **Release 1b:** Musts 10 and 11, cross-device sync and the offline cache from Must 12, and export from Must 14.
- **Must 13 (data minimization)** is not part of 1a or 1b. It is a gate on the assistant, which is a Should; the assistant does not ship without it.
- **First version done:** Releases 1a and 1b are complete and the week-12 decision review has been held. Should and Could items follow in the order listed and are not part of "first version done" (see section 8). Items cut under the cut order move to the first release after 1b and do not block "first version done".
- **Cut order if time runs short:** offline cache, then export. Metrics (Must 15), edit history and delete-all are never cut.
- **Screen states:** every screen shows an empty, a loading and an error state with a message. The exact wording is a design task.
- Calendar dates for each release are for the owner to set (see section 9).

1. **Visual planner for the day and week, with time blocks.**
   - Given a free time range, when the user creates a block, then it appears in the day and week views.
   - Given a block, when the user moves or resizes it, then the change is saved.
   - Given a move or resize that overlaps a hard event or another block, then the app shows a warning and needs a confirm tap before saving. Overlapping is allowed only after that warning.
2. **Plan-then-confirm for each block.** It includes a small "planned vs. real" summary and an optional one-line note on where you stopped and what is next.
   - Given a block whose end time has passed, when the user opens the app, then the block shows a confirmation prompt with four options: "as planned", "it took X", "partly done" and "didn't do it".
   - Given the last remaining block of a task is confirmed "as planned" or "it took X", then the app marks the task done unless the user unticks it. The task's done flag is the single source for the completion rate.
   - "It took X" has an optional actual start time. If given, the block moves to that time, and this is not a postponement. It is recorded as-is, even if it overlaps a later block or a hard event. Later blocks are then flagged "may be affected" and are not moved.
   - "Partly done": the user enters the time done and the remaining estimate. The done time is recorded, and the remainder stays as an unplanned part of the same task with that estimate.
   - "Didn't do it" counts as a postponement and offers a new slot.
   - Given a block that stays unconfirmed, then the next time the user opens the app after the end of day, an in-app banner asks to confirm it, and the block stays "unconfirmed" until then. (Push delivery arrives with Must 11.) A block can be confirmed late for up to 7 days after its end.
   - A confirmed block can be edited for up to 7 days after its end. The edit is recorded and the metrics update.
   - Unconfirmed blocks are excluded from insights and duration suggestions.
3. **Google Calendar import, read only.** Imported events are hard events.
   - The user chooses which of the account's calendars are imported. Recurring events are expanded per instance.
   - The suggester never places a block over a hard event. Manual placement over one follows Must 1 (warning and confirm tap).
   - Declined and cancelled events do not block time. Tentative events do block time. All-day events block time only if marked busy.
   - Given a new or changed Google event, then it appears in the app within 15 minutes, and the user can refresh manually.
   - Given Google Calendar is unavailable or access is revoked, then the app keeps showing the last imported events marked "as of <time>", shows a reconnect prompt, and warns when planning that events may be out of date.
   - The app and assistant never write to Google Calendar.
4. **Task priority flags.** Urgent and important are two independent yes/no flags, so a task can be both, either one, or neither (the four Eisenhower quadrants). A task can also have an optional deadline.
   - A deadline is a date that ends at the end of the day, and today counts as a remaining day. Given a task with a deadline where the calendar days remaining are at most the estimated duration plus 2 days, then the app suggests marking it urgent. The user keeps the final say. A dismissed suggestion stays dismissed for that task, and the task is then not treated as urgent by the suggester (Must 8).
   - The estimated duration in hours is converted to days using the template's working hours per day. Given no estimate, only the "within 2 days of the deadline" part applies.
5. **Weekly availability template:** working hours, sleep, meals and focus times, with per-day overrides.
   - Given a template, when the suggester looks for a slot, then it proposes only available time, as defined in the glossary.
   - Given a per-day override, then it applies to that date only.
   - The template follows a single home time zone set in settings.
6. **Tasks are created inside the app.**
   - Given a title, when the user saves, then the task exists with an optional estimate, urgent and important flags, deadline and task type.
   - A task has exactly one task type, chosen from a user-editable list. The list starts with Work, Personal, Admin and Other. A task captured quickly (Must 7) gets "Other". New types can be created inline.
   - Deleting a type moves its tasks and history to "Other", and the metrics are recomputed.
   - A task can have one or more blocks, and it is done when the user marks it done. A task with an unplanned remainder (see Must 2) is not marked done automatically.
   - Given a task is dropped, then its future planned blocks are removed, its confirmed blocks stay, and it counts as not done. A drop can be undone for 7 days.
   - Given a task is deleted, then its future blocks are removed, its confirmed blocks stay in the estimate error and in duration suggestions, and it counts as not done. Dropped and deleted tasks stay in the metrics until the user runs "delete all".
   - A single block can also be deleted.
7. **Fast capture.**
   - A task can be saved in at most 3 taps, or one typed line, counted from opening the capture entry. The test is a step count.
8. **Tasks to blocks.** A rule-based suggester proposes slots in your free time without needing the LLM. You accept or adjust.
   - Order: urgent and important first, then urgent only, then important only, then neither. A task counts as urgent if it is flagged or if the suggestion condition in Must 4 is met. Ties are broken by the nearest deadline.
   - Each task goes in the earliest available slot (as defined in the glossary, so never over a hard event, an existing block or a recovery buffer) that fits its duration, not earlier than the next quarter hour from now.
   - The duration is the task's estimate. Given no estimate, it is the default task duration, a setting that starts at 30 minutes.
   - The recovery buffer (Must 9) keeps time free after qualifying meetings; it is not added to every task.
   - The search looks ahead 14 days when the task has no deadline, and up to the deadline otherwise. In one run, each proposed slot counts as occupied for the proposals that follow. A task longer than any free range is offered a split.
   - Given no slot fits before the deadline, then the app shows "no slot fits" and offers: shrink the task, split it, move another block, or ignore the deadline.
   - The assistant (Should) can refine the suggestions in chat.
9. **Recovery buffer after long meetings.** It is a setting. The default is 10 minutes after hard events of 60 minutes or more that are not all-day, and it is adjustable. The buffer is a constraint, shown as shaded time. Placing a block inside it follows Must 1 (warning and confirm tap). The research label and the tips about it are Should.
10. **Duration suggestions from your own history.** (Wider insights are part of the Should summaries.)
    - Given at least 5 confirmed blocks for a task type ("as planned" and "it took X" only), then the app suggests a duration equal to the median block time of those blocks (the actual time for "it took X", the planned length for "as planned"). It is offered as the default estimate for new tasks of that type.
    - Given fewer, then the app says "not enough data yet" and invents no estimate.
11. **Reminders when a block starts.**
    - A web notification fires when a block starts while the app or browser is open.
    - If notification permission is denied, the app shows an in-app prompt.
    - Known limit: web notifications do not fire when the browser is closed. Reliable background delivery waits for the mobile app.
12. **Single-user account with data synced across devices.**
    - Sign-in is with a Google account (the same one used for Calendar). It is part of Release 1a.
    - If the same block is edited on two devices, the later edit, by server receive time, wins. A block's start and end are one unit, and other fields are resolved per field. The earlier version is kept in an edit history for 30 days for undo.
    - Offline, the app shows a read-only cached view.
    - Every record carries a user ID.
    - Times are stored as absolute instants together with the zone they were created in. A block created as a wall-clock time in the home zone keeps that wall-clock time across a DST change; the instant is recomputed from the creation zone. Display follows the current device zone, and the app shows a notice when the device zone differs from the home zone.
13. **Data minimization for the assistant.** The assistant sees only the fields a request needs. Data the assistant reads through tools counts as part of the request.
    - By default, a request carries durations, times, flags and an opaque task-type ID only. Task titles, notes, event titles and task-type names are off until the user turns each one on, per field.
    - Test: given a field that is off, then it never appears in the payload sent to the LLM.
    - The assistant is not released without this.
14. **Delete and export.**
    - Delete all asks for confirmation, then removes the user's data from the app database immediately. Any backups that exist are purged within 30 days. It also deletes cached Google events and the recorded metric events, and revokes the OAuth tokens.
    - Export produces a JSON file of tasks, blocks, confirmations, task types, the availability template, settings and the edit history. Re-import is not required.
    - Deleted tasks are kept as records with an ID, flags and outcome only (no title), so the metrics stay correct. They are included in the export in that form.
15. **Metrics view.** The app shows the metrics defined in section 3, computed exactly as defined there, per week, with the first 4 weeks marked as the baseline. It records the events behind them from Release 1a: task created, block created, moved or resized, confirmation, task done or dropped, and planning-view sessions with input events. Events are stored as an event type, the task or block ID and a timestamp, with no typed content, and sessions from two devices at the same time are counted once.
    - Given a fixture dataset of tasks, blocks and confirmations, then each metric matches the value computed by hand for it.
    - Given a week that ended less than 14 days ago, then the view marks its numbers as provisional.
    - The recorded events are included in the export and removed by "delete all".

### Should
- Postponement handling: a missed block triggers a prompt to reschedule it to a specific new slot instead of drifting, and the app counts postponements. A task postponed three times prompts "split it, shrink it, or drop it?". The user picks the new slot, with suggester or assistant help. Choosing a slot is manual or assisted; fully automatic replanning stays in Later.
- Overload check: the app warns you before the week starts if planned work exceeds your free time.
- Month and year planning with placeholders and reserved planning slots, plus light reminders when a planning slot arrives.
- Summaries for a day, week, month or year, shown when the user asks (for example "how was my week?" in the chat or a summary button), not pushed automatically. A summary covers:
  - how many tasks were planned, completed and postponed;
  - hours spent in total and by task type;
  - planned vs. actual time;
  - a few interesting facts from the data, such as the most postponed task, the time of day with the most completed work, or the biggest estimate miss.
- Chat assistant that matches the planner's abilities over time, refines the suggester's proposals, and reads data through tools. Given the LLM is unavailable or a cost cap is reached, the chat shows "assistant unavailable" and every planner feature keeps working.
- Email reminder fallback when the browser is closed.
- Research label and tips for the recovery buffer.
- Cited, evidence-rated advice from the curated list.

### Could
- Full plan vs. actual view for the day and week.
- Quick-confirm widgets on mobile.
- Learned adjustments to the availability template, such as "your deep work mostly happens before 11:00".

### Later
- Mobile app and desktop app.
- Guided planning view for planning slots.
- Automatic activity tracking on desktop.
- Auto-replanning when the day drifts.
- Write-back to a separate Google calendar.
- Task imports from other tools.
- Multi-user support.
- Reliable background push notifications.
- Recurring tasks and habits.
- Other calendar providers.

## 6. Platforms and sequence
Responsive web app first, then the mobile app, then the desktop app. All clients share one backend, so plans sync across devices. The architecture is decided separately.

## 7. Constraints and assumptions
- Google Calendar is the only required integration.
- Calendar access is read only in the first version. Planned blocks appear only inside the app, next to the imported Google events, so the app's own reminders are what keep the plan visible. The research behind the visual-calendar idea applies indirectly to an in-app calendar; this is an assumption to test with the owner's own data.
- To verify with an engineer before Release 1a (not yet checked): whether Google requires OAuth verification for the calendar scope, whether refresh tokens expire quickly while the app is in Google's "Testing" status, and whether web notifications on iOS Safari require a Home Screen install. Any of these could affect the release date.
- The assistant is LLM-based. Data sent to the model is minimized (Must 13).
- Time estimates come from the user's own history once enough data exists (5 confirmed blocks per task type).
- The planning fallacy research supports estimating from past durations; it is well replicated, but the evidence for time blocking itself is weak.
- The learning loop depends on the user confirming blocks. Unconfirmed blocks are excluded rather than assumed correct.
- Operations (hosting, rollout) are not specified; this is acceptable for a single-user first version. Any backups that are kept must be purgeable within 30 days (Must 14). Stored OAuth tokens must be protected at rest; the method is decided with the architecture.

## 8. Out of scope for the first version
Everything under "Later" in section 5, which means: mobile and desktop apps, guided planning view, automatic activity tracking, auto-replanning, write-back to Google Calendar, task imports, multi-user support, reliable background push, recurring tasks and habits, and other calendar providers. The first version leaves these out to keep the first release small and testable by one user, and because some depend on decisions not yet made (architecture, LLM provider). The Should and Could items are not out of scope, but they are not part of "first version done" (see section 5): they follow the Musts, in the order listed, and get acceptance criteria when they are scheduled.

## 9. Open questions
Each item is owned by the owner (Nataly), and no decision date is set yet. The first three block the Musts shown.
- Which LLM provider to use, and its data policy (retention, training use). Blocks Must 13.
- Calendar dates for Release 1a and 1b. Blocks the measurement clock in section 3.
- The checks listed in section 7 (OAuth verification, token expiry, iOS notifications). Blocks Release 1a.
- Product name. Candidates so far: Second Draft, Strata (needs a modifier), Reckon. Kairo is rejected because of an existing day-planner app of that name.
- Architecture and tech stack.
- The offline cache window, and fast capture while offline.
- First-run flow (default proposal: ask the owner to connect Calendar and set the availability template; until a template exists the suggester proposes nothing).
- Who curates the evidence list, and its rating scale.
- Evidence gaps: Pomodoro and 52/17, chronotype, sleep, deep-work block length, weekly review rituals.
- Behavior not yet defined: notification deduplication across devices; the availability template's behavior when it conflicts with calendar events; limits on tasks, blocks and history length; the LLM cost cap value; accessibility and language requirements; time-zone handling of imported events; what a block shows after its 7-day confirmation window closes.

## Changelog
