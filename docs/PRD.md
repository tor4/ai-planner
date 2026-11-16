---
title: "AI Planner PRD"
working_title: "AI Planner"
owner: Nataly
version: 0.3
date: 2026-11-16
status: approved
approved_on: 2026-11-16
---

# Product Requirements Document: AI Planner

The product name is undecided; see "Open questions".

## 1. Problem and vision
Many people have more to do than they can keep track of, and they procrastinate. Tasks that stay on a to-do list get postponed again and again. Giving a task a specific time on a visual calendar is expected to help. Research on specific "when and where" plans (implementation intentions) is well supported; the evidence for time blocking itself is weaker (see `docs/research/2026-10-30-evidence-base.md`). This product bets on the first and treats the second as a hypothesis that the owner's own data will inform (see the week-12 decision review in section 3). Today planning is manual work, and the plan has no memory: nobody records how it really went, so the next plan repeats the same optimistic errors.

The owner chose to build rather than adopt an existing planner, to test the plan-then-confirm loop directly and to keep full control of the data.

AI Planner helps people turn everything they have to do into a visual plan for the day, week, month and year, so tasks get done instead of postponed. It records what actually happened, and uses each person's own history, plus published research, to make every plan more realistic than the last.

## 2. Users
- **Primary:** the owner, as a personal tool.
- **Later:** other people. The first version is single-user. Every stored record carries a user ID, so multi-user support does not need a data-model rewrite.

## 3. Goals and success metrics
Weeks start on Monday, in the home time zone. The measurement clock starts on the first Monday after Release 1a has been used on at least 5 of 7 consecutive days. A week's numbers are final 14 days after the week ends, when the 7-day late-confirmation and edit windows (including the done flag) have closed.

- **Core goal:** tasks get done instead of being postponed again. Everything you need to do ends up as a block with a time on the app's calendar. Planned blocks live only in the app (see section 8).
- **Base goal:** daily use without forcing yourself. Planning and confirming a day takes about 5 minutes or less.

**Reported metrics.** The metrics view (Must 15) shows these numbers weekly. They are inputs to the decision review below, not pass/fail gates, because one person's data is too small for a statistical test.
- **Completion rate:** tasks whose first block was scheduled in the week that were marked done by the end of that same week, divided by all tasks whose first block was scheduled in the week. The cohort week is the week containing the start of the task's first block at the moment it is created, and it is frozen. A task whose blocks span several weeks therefore counts as not done unless it is finished by the end of its cohort week; this is intended. It does not move when the block moves. A task that is postponed, dropped or deleted stays in the denominator as not done. The done time is the end time of the last confirmed block when the task was marked done by confirmation (Must 2), and otherwise the time the user marked it. The done flag can be changed for 7 days after it is set.
- **Postponement rate:** postponed blocks divided by blocks originally scheduled in the week whose start time has passed. Each postponement event counts once, so a block postponed twice counts twice. The count of missed blocks is shown next to it, because a block skipped in silence is not a postponement until the user acts. "Originally scheduled" means the week of the block's start when it was created, frozen. A postponement counts toward that original week.
- **Early-move rate:** moves of a block to a later week before it starts, divided by blocks originally scheduled in the week. Each move counts once, so a block moved twice counts twice and the rate can exceed 100%. A move counts toward the block's original week.
- **Scheduled share:** tasks with at least one block divided by tasks created, counted in the week the task was created. It is evaluated when that week's numbers become final, so blocks added up to then count.
- **Estimate error:** |actual time − planned time| / planned time, where planned time is the block's frozen planned length: its length at the moment its start time passes. A rescheduled block freezes it again at its new start. It covers "as planned" and "it took X" blocks, and excludes "partly done" blocks. A block counts in the week of its start time at confirmation. This differs on purpose from the other metrics, which use the original week, because estimate error is about when the work actually happened. It is shown with the signed overrun, the planned-hours trend and the share of "as planned" confirmations, so that padding and rubber-stamping are visible. A reference level of 20% median error is used for judgment.
- **Confirmation rate:** confirmed blocks divided by blocks whose end time passed more than 7 days ago, excluding blocks marked "dropped" (Must 6). Only blocks in the denominator count in the numerator. A block counts toward its original week. The unconfirmed share is shown with it. The learning loop needs about 70% or more.
- **Planning time:** a day's planning time is the active editing time that day: capture, running the suggester, creating, moving or resizing blocks, and confirmation prompts, from opening a prompt to saving it (including late confirmations of earlier days). Just viewing the planner does not count. Idle gaps longer than 60 seconds without input events are excluded. Active days per week are shown next to it.
- **Load guardrail:** two numbers per week, by block start in the home zone:
  - planned block hours divided by the week's template time (working, focus and personal ranges, minus hard events);
  - hours of blocks placed outside their task type's available time, inside recovery buffers, or over hard events.
  
  It flags overwork as the app moves more work into blocks.

**Decision review.** The week-12 decision review is held at the end of week 14, when weeks 1 to 12 are all final. The owner reviews the trends and decides to continue, change the approach or stop. Questions to ask:
- Is the completion rate stable and high, or rising compared with the first 4 weeks?
- Is the confirmation rate at least about 70%? If not, fix the confirm flow before anything else, since insights depend on it.
- Is planning time within about 5 minutes a day?
- Are the early-move and postponement rates falling?
- Is the load guardrail stable, without a rising share of blocks outside available time?

If the answers are mostly no, candidate changes are writing blocks to Google Calendar and a lighter confirm flow. There are no fixed thresholds, because the review is a judgment.

**Known limits.** The first 4 weeks are measured with the tool, so they show change after the first weeks of use, not a comparison with life before the tool. A 2-week manual log before starting is optional and recommended. Features delivered during the 12 weeks (Release 1b) change the tool; note the dates in the review.

## 4. How it works
- **Planning at four scales.** Day and week hold detailed time blocks. Month and year start as rough placeholders, such as a vacation in mid-July, with reserved planning slots to add detail later.
- **Plan-then-confirm.** You plan blocks, then confirm what happened (as planned, it took X, partly done, or didn't do it).
- **Adaptation.** The app shows insights from your history and suggests durations while you plan (for example, "this usually takes you 1.6h").
- **LLM-first, planner-complete.** Every Must action can be done in the visual planner without the assistant, so the app works if the LLM is unavailable. This includes slot suggestions, which come from a rule-based suggester. The chat assistant matches the planner's abilities as the Should items are delivered, refines suggestions, and reads your data through tools; it does not guess.
- **Evidence-based advice.** Tips come from a curated, cited list (see `docs/research/2026-10-30-evidence-base.md`), each with an evidence rating. Wellbeing guidance only, never medical advice.

### Glossary
- **Block:** a task, or a part of a task, placed at a specific time on the app's calendar. A task has one or more blocks. A block is at least 15 minutes long and cannot cross midnight in the home zone.
- **Placeholder:** a rough entry on the month or year view, without a precise time.
- **Planning slot:** a block reserved for adding detail to a placeholder later. It is a normal block of an automatically created task named "Plan: <placeholder>", and it counts in every metric like any task.
- **Hard event:** an imported Google Calendar event that blocks time (see Must 3).
- **Unconfirmed block:** a block whose end time has passed and has not been confirmed. Once its 7-day confirmation window closes, it is shown as "Unconfirmed, window closed": locked, no longer asking for confirmation, and excluded from insights.
- **Missed block:** an unconfirmed block that is 30 minutes past its end time. It triggers the reschedule prompt (see Should, postponement handling).
- **Postponement:** a block that did not happen at its planned time. It is counted once per miss.
  - It happens when a block whose start has passed is confirmed "didn't do it", is moved to a new time (a missed block that is rescheduled, or any past unconfirmed block that is moved), or is marked "dropped" because its task was dropped or deleted (Must 6).
  - "Didn't do it" followed by rescheduling counts as one postponement, not two.
  - A rescheduled block is the same block moved, so it keeps its frozen original start and original week. If it is missed again at its new time, that counts as another postponement.
  - It is not a postponement when the user confirms the block happened at the new time, with "as planned" or "it took X".
  - Moving a block before it starts is not a postponement. "Partly done" is not a postponement. A missed block that is never rescheduled stays unconfirmed.
- **Focus time:** part of the working hours that the suggester fills first with important tasks (Must 8).
- **Personal time:** ranges in the template outside working hours, such as evenings and weekends, when personal tasks can be planned.
- **Task type:** exactly one per task, chosen from a user-editable list (see Must 6).
- **End of day:** the end of that day's last working or personal time range in the availability template, or 21:00 if none is set.
- **Available time:** for a given task, the template ranges its task type may use, minus hard events, existing blocks and recovery buffers. Task types use work time (working hours, including focus time), personal time, or any (Must 6). Sleep and meals are never available. Given no template is set, there is no available time, and the suggester proposes nothing and prompts the user to set the template.

## 5. Prioritized requirements

### Must
Each item has acceptance criteria. Thresholds are the owner's agreed defaults.

Release stages:
- **Release 1a (the loop):** Musts 1 to 9, 11, 15 and 16, plus Google sign-in with the allow-list, the user ID on every record, instant-plus-zone storage and the edit rules from Must 12, and delete-all from Must 14, because 1a holds personal data and Google tokens. Data is stored on the server under the user's account from the start, so nothing needs migrating when sync arrives. The recording of the events behind the metrics starts in 1a. Tasks carry a frozen first-block week, and blocks carry a frozen original start time and a frozen planned length, as stored fields, so the metrics can be rebuilt without the edit history.
- **Release 1b:** Musts 10, 17 and 18, cross-device sync and the offline cache from Must 12, and export from Must 14.
- **Must 13 (assistant data minimization and safety)** is not part of 1a or 1b. It is a gate on the assistant, which is a Should; the assistant does not ship without it.
- **Non-functional requirements** (section 6) are tagged 1a, 1b, Website or Public, and each release includes the ones tagged for it.
- **Public website:** a separate release after 1b (section 6.10). It needs the product name and domain.
- **First version done:** Releases 1a and 1b are complete and the week-12 decision review has been held. Should and Could items follow in the order listed and are not part of "first version done" (see section 9). Items cut under the cut order move to the first release after 1b and do not block "first version done".
- **Cut order if time runs short:** offline cache, then export. Metrics (Must 15), edit history and delete-all are never cut.
- **Screen states:** every screen shows an empty, a loading and an error state with a message. The exact wording is a design task.
- Calendar dates for each release are for the owner to set (see section 10).

1. **Visual planner for the day and week, with time blocks.**
   - Given available time (see glossary), when the user creates a block, then it appears in the day and week views.
   - Given a block, when the user moves or resizes it, then the change is saved.
   - Given a create, move or resize that overlaps a hard event, another block or a recovery buffer, then the app shows a warning and needs a confirm tap before saving. Overlapping is allowed only after that warning.
2. **Plan-then-confirm for each block.** It includes a small "planned vs. real" summary and an optional one-line note on where you stopped and what is next.
   - The summary shows the block's planned length next to its actual time, and the day's total planned hours next to its confirmed hours. The full plan vs. actual view remains a Could.
   - Given a block whose end time has passed, when the user opens the app or while it is open, then the block shows a confirmation prompt with four options: "as planned", "it took X", "partly done" and "didn't do it".
   - Given the last remaining block of a task is confirmed "as planned" or "it took X", then the app marks the task done unless the user unticks it, or the task has an unplanned remainder (Must 6). The task's done flag is the single source for the completion rate.
   - "It took X" has an optional actual start time. If given, the block moves to that time, and this is not a postponement. It is recorded as-is, even if it overlaps a later block or a hard event. Later blocks are then flagged "may be affected" and are not moved. If the actual time would make the block cross midnight, the block ends at midnight and the full actual time is still recorded.
   - "Partly done": the user enters the time done and the remaining estimate. The done time is recorded, and the remainder stays as an unplanned part of the same task with that estimate. A remainder under 15 minutes is planned as a 15-minute block.
   - "Didn't do it" counts as a postponement and offers a new slot for the same block. Accepting the slot does not add a second postponement (see glossary).
   - Given a block that stays unconfirmed, then the next time the user opens the app after the end of day, an in-app banner asks to confirm it, and the block stays "unconfirmed" until then. (Must 11 adds notifications when a block starts and when it ends, while the app is open.) A block can be confirmed late for up to 7 days after its end.
   - A confirmed block can be edited for up to 7 days after its end. The edit is recorded and the metrics update.
   - Unconfirmed blocks are excluded from insights and duration suggestions.
   - "It took X" and the time done for "partly done" accept 1 minute to 24 hours.
   - Given the block was moved or resized on another device after the user opened it, when the user confirms, then the app shows the new time and asks the user to confirm again. This is the one exception to "the later edit wins" (Must 12).
   - Given the task is already marked done, then confirming one of its past blocks never plans more work: "didn't do it" counts as a postponement but offers no new slot, and "partly done" records the time done with no remainder.
   - Unconfirmed blocks are listed oldest first in a "To confirm" list. The notification, the in-app prompt and the end-of-day banner open it, and a block in the calendar can also be confirmed directly. A block that is 30 minutes past its end is labelled "Missed" there; the reschedule prompt for missed blocks stays a Should (postponement handling).
3. **Google Calendar import, read only.** Imported events that block time, under the rules below, are hard events.
   - The user chooses which of the account's calendars are imported. Recurring events are expanded per instance.
   - The suggester never places a block over a hard event. Manual placement over one follows Must 1 (warning and confirm tap).
   - Declined and cancelled events do not block time. Tentative events do block time. All-day events block time only if marked busy, and then they block the whole day. Timed events marked "free" do not block time. Events with no response yet block time.
   - Given a new or changed Google event, then it appears in the app within 15 minutes, and the user can refresh manually.
   - Given Google Calendar is unavailable or access is revoked, then the app keeps showing the last imported events marked "as of <time>", shows a reconnect prompt, and warns when planning that events may be out of date.
   - Given the user declines calendar access on Google's consent screen, or skips connecting it in first setup, then sign-in still succeeds and the calendar can be connected later from Settings.
   - The app and assistant never write to Google Calendar.
4. **Task priority flags.** Urgent and important are two independent yes/no flags, so a task can be both, either one, or neither (the four Eisenhower quadrants). A task can also have an optional deadline.
   - A deadline is a date that ends at the end of the day, and today counts as a remaining day. Given a task with a deadline where the calendar days remaining are at most the estimated duration plus 2 days, then the app suggests marking it urgent. The user keeps the final say. A dismissed suggestion stays dismissed for that task, and the task is then not treated as urgent by the suggester (Must 8). Changing the deadline clears the dismissal.
   - The task's unscheduled time (Must 8) is converted to days by counting forward from today. Each day adds the template hours, including overrides, that the task's type may use on that day, until the total covers the estimate. Days with no such hours still count as days.
   - Given no estimate, only the "within 2 days of the deadline" part applies.
5. **Weekly availability template:** working hours, focus times, personal time, sleep and meals, with per-day overrides.
   - Given a template, when the suggester looks for a slot, then it proposes only available time, as defined in the glossary.
   - Given a per-day override, then it applies to that date only. "Day off" is an override that clears work and focus time only.
   - The template follows a single home time zone set in settings.
   - First setup offers a prefilled starter template (Mon–Fri 09–17 work with 09–11 focus, evenings personal, meals and sleep), accepted with one tap or edited first. The template step cannot be skipped.
6. **Tasks are created inside the app.**
   - Given a title, when the user saves, then the task exists with an optional estimate, urgent and important flags, deadline and task type.
   - A task has exactly one task type, chosen from a user-editable list. The list starts with Work, Personal, Admin and Other. A task captured quickly (Must 7) gets "Other". New types can be created inline.
   - Each task type uses work time, personal time or any time, which decides the available time the suggester may use for it. Defaults: Work and Admin use work time, Personal uses personal time, Other uses any. New types use any until changed.
   - Deleting a type moves its tasks and history to "Other", and the metrics are recomputed. It asks inline first and has no undo. "Other" cannot be deleted.
   - A task can have one or more blocks, and it is done when the user marks it done. A task with an unplanned remainder (see Must 2) is not marked done automatically.
   - Given the user marks a task done, then its future planned blocks are removed (not a postponement), its past unconfirmed blocks stay in the "To confirm" list, and its confirmed blocks are unchanged. Unticking it within 7 days restores the removed blocks whose start has not passed.
   - Given a task is dropped, then its future planned blocks are removed, its confirmed blocks stay, and it counts as not done. A drop can be undone for 7 days. Undo restores the task and the removed blocks whose start has not passed yet. The time of the others becomes unscheduled time again.
   - Given a task is dropped or deleted, then its past unconfirmed blocks are marked "dropped". They stop asking for confirmation, are left out of the confirmation rate, and each counts as one postponement (see glossary).
   - Deleting a task can be undone only from the undo message (section 6, U3). After that, its title is removed (Must 14). Dropping is the way to keep a task recoverable for 7 days. A deleted single block can be restored for 7 days.
   - Given a task is deleted, then its future blocks are removed, its confirmed blocks stay in the estimate error and in duration suggestions, and it counts as not done. Dropped and deleted tasks stay in the metrics until the user runs "delete all".
   - A single unconfirmed block can also be deleted. Confirmed blocks cannot be deleted, because estimates and metrics depend on them; a wrong confirmation is edited instead (Must 2).
7. **Fast capture.**
   - A task can be saved in at most 3 taps, or one typed line, counted from opening the capture entry. The test is a step count.
8. **Tasks to blocks.** A rule-based suggester proposes slots in your free time without needing the LLM. You accept or adjust.
   - **Input.** A run starts when the user asks. It plans the open tasks the user selects, which by default are all open tasks with unscheduled time.
     - A task's unscheduled time is its estimate minus the time in its planned and confirmed blocks. After "partly done", it is the remaining estimate the user entered (Must 2).
     - A task with no estimate and no blocks uses the default task duration. A task with no estimate that already has a block has no unscheduled time.
   - Order: urgent and important first, then urgent only, then important only, then neither. A task counts as urgent if it is flagged or if the suggestion condition in Must 4 is met. Ties are broken by the nearest deadline (tasks without a deadline come last), then by the oldest task.
   - Each task goes in the earliest available slot (as defined in the glossary, so never over a hard event, an existing block or a recovery buffer) that fits its duration, not earlier than the next quarter hour from now.
   - For an important task that uses work time, the earliest fitting slot in focus time is used if one exists within the search window. Otherwise the earliest available slot is used.
   - The duration is the task's unscheduled time. The default task duration is a setting that starts at 30 minutes. Slots start on 15-minute marks.
   - The recovery buffer (Must 9) keeps time free after qualifying meetings; it is not added to every task.
   - The search looks ahead 14 days when the task has no deadline, and up to the deadline otherwise. In one run, each proposed slot counts as occupied for the proposals that follow. A task longer than any free range is offered a split into the fewest parts that fit, each at least 30 minutes, placed earliest first. Each part is a separate block of the same task.
   - Given no slot fits before the deadline, then the app shows "no slot fits" and offers: shrink the task, split it, move another block, or ignore the deadline.
   - The assistant (Should) can refine the suggestions in chat.
9. **Recovery buffer after long meetings.** It is a setting. The default is 10 minutes after hard events of 60 minutes or more that are not all-day, and it is adjustable. Back-to-back hard events with no gap count as one event for the 60-minute rule. The buffer is a constraint, shown as shaded time. Placing a block inside it follows Must 1 (warning and confirm tap). The research label and the tips about it are Should.
10. **Duration suggestions from your own history.** (Wider insights are part of the Should summaries.)
    - Given at least 5 done tasks of a task type whose blocks are all confirmed, then the app suggests a duration equal to the median total time of those tasks. A task's total time is the sum of its blocks:
      - the planned length for "as planned";
      - the actual time for "it took X";
      - the time done for "partly done";
      - zero for "didn't do it".
      
      The suggestion is offered as the default estimate for new tasks of that type.
    - Given fewer, then the app says "not enough data yet" and invents no estimate.
11. **Reminders when a block starts and ends.**
    - A web notification fires when a block starts while the app or browser is open.
    - Given a block ends while the app is open, then a notification asks the user to confirm it. If notifications are off, an in-app prompt is shown instead.
    - If notification permission is denied, the app shows an in-app prompt.
    - Permission is asked after the first block is saved, never on app load. "Not now" waits 7 days before asking again, and Settings can turn reminders on at any time.
    - Known limit: web notifications do not fire when the browser is closed. Reliable background delivery waits for the mobile app.
12. **Single-user account with data synced across devices.**
    - Sign-in is with a Google account (the same one used for Calendar). It is part of Release 1a.
    - Only Google accounts on an allow-list can sign in. In the first version the list holds only the owner. Given any other account, then sign-in is refused with an "invite only" message and no data is stored. This is part of Release 1a.
    - If the same block is edited on two devices, the later edit, by server receive time, wins. The one exception is confirming a block that was moved on another device (Must 2). A block's start and end are one unit, and other fields are resolved per field. The earlier version is kept in an edit history for 30 days. The history is read-only, for audit and support. An overwritten edit can be restored for 7 days, the same window as other undo and edit actions.
    - Offline, the app shows a read-only cached view (Release 1b).
    - Before the cached view exists (Release 1a), losing the connection keeps the current screen visible with a banner, disables every action that changes data, and keeps typed text in its field.
    - Given the session ends while the user is working, then a dialog offers sign-in in a pop-up over the current screen, so typed text is kept. If the browser blocks the pop-up, sign-in happens on a full page, unsaved text is kept in that browser tab only, and the app returns to the same screen with the text restored.
    - Every record carries a user ID.
    - **Time zones.**
      - Blocks are always created and stored as wall-clock times in the home zone, together with their absolute instants. This holds even when the device is in another zone.
      - A block keeps its wall-clock time across a DST change, and its instant is recomputed.
      - Midnight, weeks, deadlines and the end of day use the home zone.
      - Display follows the current device zone, and the app shows a notice when the device zone differs from the home zone.
    - Given the user changes the home zone, then:
      - frozen weeks (section 3) never change;
      - future planned blocks keep their wall-clock time in the new zone, which is not a postponement;
      - past blocks are unchanged.
13. **Assistant data minimization and safety.** The assistant is not released without all of the following.
    - **Minimization.** The assistant sees only the fields a request needs. Data the assistant reads through tools counts as part of the request. By default, a request carries durations, times, flags and an opaque task-type ID only. Task titles, notes, checklist steps, event titles and task-type names are off until the user turns each one on, per field. Event descriptions and attendees are never sent. The switches are shown once, on the first open of the chat, and then live only in Settings; closing that screen without choosing keeps them all off, and the chat never asks the user to share more.
    - Test: given a field that is off, then it never appears in the payload sent to the LLM.
    - **Untrusted text.** Calendar text, task titles, notes and task-type names are data, never instructions. Given such text contains instructions, the assistant does not follow them.
    - **Approval.** Given any change proposed by the assistant, then it is applied only after the user accepts it in the UI. Every rule that applies to planner actions, including hard-event protection (Must 1), applies to assistant actions in the same way. The assistant has no way to delete all data, export, change settings or change the calendar connection.
    - **Own data only.** The assistant can read and propose changes only for the signed-in user's data.
    - **Safe replies.** Replies are shown as text with basic formatting. Links are shown as plain text, and images and HTML in replies are never loaded or rendered.
    - **Limits.** Each user has a rate limit and a daily cost cap. Given either is reached, then the chat shows "assistant unavailable" and the planner keeps working.
    - **Trustworthy approval.** The proposal the user sees is built from the actual command and its arguments, not from the model's description of it, and it lists every item it changes. It is checked again against current data when accepted. One proposal changes at most 10 items.
    - **Grounded answers.** Numbers, dates and times in replies come from tool results. Research claims cite only the curated evidence list. Statements about the user's history name their basis. Given a question the tools cannot answer, the assistant says so instead of guessing.
    - **Hidden text.** Before text is sent to the model or shown in chat, invisible characters, text-direction control characters and Unicode tag characters are removed or shown visibly.
    - **Chat history.** Kept 30 days, and included in export and delete all. Earlier tool results are never reused as trusted context in later conversations.
    - **Tool input limits.** One tool call reads at most 13 months of data and returns at most 500 items. Larger requests are refused with a message.
    - **Scope.** The assistant answers only planning-related requests and politely declines others.
    - **Wellbeing.** The assistant gives no medical or psychological advice. Given a message that suggests distress or crisis, it responds with care and points to crisis resources. It never proposes cutting sleep, meals or breaks.
    - **LLM provider.** The provider must not train on the user's data, must keep requests no longer than the delete-all promise allows (Must 14), and must process data in the EU (section 6, PR6). The exact model version is pinned.
    - **Oversight.** The app records proposed, accepted and rejected actions, tool errors and refusals, using IDs only and no text. The owner is alerted on unusual patterns, such as a spike in rejected proposals or tool calls.
    - **Future channels.** Any later feature that lets data leave the app, such as write-back to Google Calendar (Later), gives the assistant no direct write access and requires a review of this list.
    - **Transparency (EU AI Act).** The chat is clearly labeled as an AI assistant. Suggestions from the assistant are marked as such, separately from the rule-based suggestions. A short "How the assistant works" page explains what data is sent and what the assistant can and cannot do.
    - **No manipulation (EU AI Act).** Nudges and advice are visible, explained and dismissible. No fake urgency, streak pressure or other dark patterns.
    - **Compliance check.** The EU AI Act and GDPR assessment is reviewed before the assistant launches, including a data processing agreement with the LLM provider. It is reviewed again before other people use the app, and whenever a feature changes the app's purpose (for example, use by an employer to assign or monitor work).
    - Test: a fixed set of adversarial cases is run before each assistant release, and again whenever the model, the prompt or the tools change. It covers:
      - adversarial chat prompts;
      - calendar events and task titles containing instructions or hidden characters;
      - proposals whose description differs from their effect;
      - oversized tool requests;
      - off-topic requests;
      - distress messages.
      
      No case may cause an unapproved change, a rule bypass, a hidden field in a reply or payload, an ungrounded number, or a reply that breaks the scope or wellbeing rules.
14. **Delete and export.**
    - Delete all asks for confirmation by typing "delete", then removes the user's data from the app database immediately. Any backups that exist are purged within 30 days. It also deletes cached Google events and the recorded metric events, and revokes the OAuth tokens.
    - Export produces a JSON file of:
      - tasks, blocks, confirmations and task types;
      - the availability template and settings;
      - the edit history and the recorded metric events (Must 15);
      - the user's audit log entries and imported calendar events;
      - assistant chat history, once the assistant exists (Must 13).
      
      Re-import is not required.
    - Deleted tasks are kept as records with an ID, flags and outcome only (no title), so the metrics stay correct. They are included in the export in that form.
15. **Metrics view.** The app shows the metrics defined in section 3, computed exactly as defined there, per week, with the first 4 weeks marked as the baseline. It records the events behind them from Release 1a: task created, block created, moved or resized, confirmation, task done or dropped, and planning sessions (section 3, planning time). Sessions from two devices at the same time are counted once.
    - Each event stores its type, the task or block ID, a timestamp and the data the metrics need, with no typed content:
      - block moves and resizes store the old and new start and end;
      - confirmations store the outcome, the actual time and the actual start;
      - done-flag changes store the old and new value.
    - Given only the events and the frozen fields, then every metric in section 3 can be recomputed, without the edit history.
    - Given a fixture dataset of tasks, blocks and confirmations, then each metric matches the value computed by hand for it.
    - Given a week that ended less than 14 days ago, then the view marks its numbers as provisional.
    - The recorded events are included in the export and removed by "delete all".
16. **Accessibility.** The app meets WCAG 2.2 level AA.
    - Given any action that uses dragging (create, move or resize a block), then the same action can be done without dragging, with the keyboard or with start and end fields.
    - The day and week planners, capture, confirmation and settings can be used with the keyboard alone and with a screen reader (at least VoiceOver on macOS and iOS).
    - Block states (planned, unconfirmed, missed, hard event, recovery buffer, "may be affected") are never shown by color alone.
    - The app works at 200% zoom and respects the system's reduced-motion setting.
    - Every browser notification has an in-app equivalent.
    - Test: the automated checks in section 6 (A8) report zero violations on every screen, and a manual keyboard and screen reader pass is done before each release.
    - The detailed accessibility requirements are in section 6.1.
17. **Checklists (subtasks) inside a task.** A task can have a checklist of steps, for example "Tax return: collect receipts, fill in the form, submit".
    - A step has text and a done tick. Steps can be added, edited, reordered and deleted. A task has at most 50 steps.
    - Steps have no estimate, type, flags or blocks of their own. The user ticks them during the task's blocks, from the block or the task.
    - Given every step is ticked, then the app suggests marking the task done. The user decides. Ticking steps never marks a task done on its own.
    - Steps do not affect the metrics (section 3). Metrics stay per task.
    - Checklist steps are user text: they are off by default for the assistant (Must 13), removed when a task is deleted (Must 14), and included in the export.
18. **Recurring tasks.** A task can repeat, so routine work does not need to be entered again.
    - **Repeat rules:** daily, on chosen weekdays, weekly, every N weeks, or monthly (on a date, or on a day such as "the first Monday"). A rule can have an end date or a number of occurrences.
    - **Fixed or flexible.** A recurring task has either:
      - a fixed time, for example "Mondays 08:00–08:30"; or
      - a flexible weekly target, for example "gym 3 times a week". This can be limited to chosen days and a time of day (morning, afternoon or evening).
    - **Occurrences are ordinary tasks.**
      - Each occurrence is created as its own task, with the same title, type, flags, estimate and checklist (unticked).
      - Confirmation, postponement, drop, delete and all metrics work for it as for any task. Its completion-rate cohort is the week of its own first block.
    - **Creation window.** Occurrences are created for the next 14 days, and the next occurrence always exists. All times use the home zone (Must 12).
    - **Fixed-time occurrences** are created with their block at that time. Given that time overlaps a hard event, another block or a recovery buffer, then the occurrence is still created, flagged "may be affected", and shown for the user to resolve. It is never moved silently.
    - **Flexible occurrences** are created without blocks, one task per required time in the week. The suggester (Must 8) includes them in its runs by default, places at most one occurrence of a series per day, spreads them across the allowed days, and respects the time-of-day limit.
    - **No pile-up.** An occurrence that is not done by the end of its period counts as not done. It is not carried into the next period, and the next occurrence is created as normal.
    - **Editing.** Changing a recurring task offers "this occurrence" or "this and future occurrences". Changes never touch past or confirmed occurrences. Ending or deleting a series removes its future occurrences and keeps past ones. It asks no question and can be undone from the Undo message, like deleting tasks (section 6, U3).
    - Duration suggestions (Must 10) treat occurrences as tasks of their type.

### Should
- Postponement handling: a missed block triggers a prompt to reschedule it to a specific new slot instead of drifting, and the app counts postponements. A task postponed three times prompts "split it, shrink it, or drop it?". The user picks the new slot, with suggester or assistant help. Choosing a slot is manual or assisted; fully automatic replanning stays in Later.
- Overload check: the app warns you before the week starts if planned work exceeds your free time.
- Month and year planning with placeholders and reserved planning slots, plus light reminders when a planning slot arrives. A placeholder that has been detailed stays on the month and year views as a summary linked to its tasks. Deleting a placeholder keeps its tasks as ordinary tasks.
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
- Habit tracking beyond recurring tasks (habit statistics and history views). There are no streaks, because of the no-manipulation rule in Must 13.
- Other calendar providers.

## 6. Non-functional requirements
These apply across all features. Each one is measurable and is tagged with when it must be met:
- **1a** or **1b**: part of that release.
- **Website**: part of the public website release, after 1b (section 6.10).
- **Public**: before anyone other than the owner uses the app. Website and Public items are not part of "first version done".

The owner (Nataly) owns every item. The app is used in the EU and the US and may later be offered worldwide. Where EU and US rules differ, the stricter one applies.

### 6.1 Accessibility
Must 16 sets the target (WCAG 2.2 level AA). In addition:
- **A1 Keyboard (1a).** Every interactive element can be reached and operated by keyboard. Focus is always visible, there are no keyboard traps, and each screen has a "skip to content" link.
- **A2 Semantics (1a).** Native HTML elements are used first, and ARIA only where HTML cannot do the job. Each screen has one top-level heading, headings in order, and landmarks. Every form control has a programmatic label.
- **A3 Visual (1a).**
  - Text contrast is at least 4.5:1, and 3:1 for large text and UI components, in both light and dark themes.
  - Content reflows at 320 px width without horizontal scrolling, and text can be resized to 200% without loss of content.
- **A4 Targets (1a).** Touch targets are at least 24 × 24 px. The primary touch actions (capture, the four confirmation options) are at least 44 × 44 px.
- **A5 Forms (1a).** An error message names the field and suggests a fix. Entered data is kept after an error.
- **A6 Motion and media (1a).** Animations follow the system's reduced-motion setting. Images that carry meaning have alt text. The app has no audio or video.
- **A7 Screen readers.** VoiceOver on macOS and iOS (1a). NVDA on Windows and TalkBack on Android (1b).
- **A8 Automated checks (1a).** CI runs axe with the WCAG 2.0, 2.1 and 2.2 level A and AA rules on every screen and state, and reports zero violations.
- **A9 Legal (Public).** Publish an accessibility statement. Review conformance with EN 301 549 for the European Accessibility Act, and with the ADA. Check whether the EAA's microenterprise exemption applies.

### 6.2 Performance
- **P1 Core Web Vitals (1a).** At the 75th percentile over a rolling 28 days, measured from real use and backed by lab runs in CI (Lighthouse), because one user produces few samples: Largest Contentful Paint ≤ 2.5 s, Interaction to Next Paint ≤ 200 ms, Cumulative Layout Shift ≤ 0.1.
- **P2 Planner feedback (1a).** Dragging, resizing, creating and confirming a block show their result within 100 ms, without waiting for the server. A failed save is shown and rolled back.
- **P3 API (1a).**
  - Server response time: p95 under 500 ms, excluding the first request after idle.
  - The first request after the database has been idle may take up to 3 s, with a loading state shown. This is accepted because of free-tier hosting.
- **P4 Budgets (1a).** Checked in CI:
  - JavaScript for the first screen is at most 200 KB compressed.
  - Raster images are at most 100 KB each, in WebP or AVIF; icons are SVG.
- **P5 Slow networks (1a).** On a simulated slow 4G connection, the day view is usable within 5 s.

### 6.3 Security
- **S1 Baseline.** OWASP Top 10. The OWASP ASVS level 1 checklist is completed for 1a, and level 2 before Public.
- **S2 Transport and headers (1a).** HTTPS only, with HSTS. Every response carries:
  - a Content Security Policy without inline scripts;
  - `X-Content-Type-Options: nosniff`;
  - `frame-ancestors 'none'`;
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  An automated test checks the headers.
- **S3 Sign-in and sessions (1a).** Sign-in is with Google only, so multi-factor authentication comes from the Google account, and the app recommends turning on Google 2-Step Verification.
  - Session cookies are HttpOnly, Secure and SameSite=Lax.
  - A session expires after 30 days without use, and after 90 days in any case.
  - The user can sign out on all devices.
- **S4 Rate limits (1a).** At most 10 sign-in attempts per minute per IP address, and 300 API requests per minute per user. Excess requests are rejected with a clear message. There are no passwords, so there is no lockout.
- **S5 Input and data (1a).**
  - Every request is validated on the server.
  - User text is never rendered as HTML.
  - All database queries are parameterized.
  - All writes have CSRF protection.
  - Data is encrypted in transit (TLS) and at rest. Google tokens are encrypted by the app, and the database by the provider.
  - Secrets are kept only in the hosting providers' secret stores.
- **S6 Supply chain (1a).**
  - Dependency scanning and static analysis run on every pull request.
  - A release ships with no known high or critical vulnerabilities in production dependencies.
  - The lockfile is committed.
- **S7 Audit log (1a).** The app logs sign-in, sign-out, Google Calendar connect and disconnect, export, delete all, and changes to the assistant data settings. Each entry holds the action, time, user ID and device type, and entries are kept 12 months. Delete all removes the user's entries and keeps one anonymous record that a deletion happened.
- **S8 Testing (Public).** Run an automated dynamic security scan and an external penetration test.
- The assistant's security requirements are in Must 13.

### 6.4 Privacy and compliance
- **PR1 Baseline (1a).** GDPR, applied worldwide. The same features cover CCPA/CPRA rights. Personal data is never sold or shared for advertising.
- **PR2 Cookies (1a).** Only strictly necessary cookies (the session). There are no advertising or third-party analytics cookies, so no consent banner is needed. If that changes, a consent banner with "decline" as the default is required first.
- **PR3 Data rights (1a and 1b).** Access and export (Must 14, 1b), deletion (Must 14, 1a), and correction through normal editing.
- **PR4 Minimization (1a).** Store only what a feature needs. Logs and error reports never contain task titles, notes or event text. IP addresses are used for rate limiting and are not stored longer than logs.
- **PR5 Retention (1a).**

  | Data | Kept |
  |---|---|
  | Tasks, blocks, settings, metric events | Until delete all |
  | Edit history | 30 days |
  | Assistant chat history | 30 days |
  | Imported calendar events | Until 13 months after they end |
  | Backups | At most 30 days (Must 14) |
  | Logs and error reports | At most 30 days |
  | Audit log | 12 months |

- **PR6 Residency (1a).**
  - Data is stored in an EU region. The app's own processing (API, database, backups, error tracking) runs in EU regions.
  - Data leaves the EU only through listed sub-processors that need it, such as Google for sign-in and Calendar. Each has a data processing agreement and a valid transfer basis, for example the EU-US Data Privacy Framework or standard contractual clauses.
  - The list of sub-processors is kept current. This wording is checked legally before Public.
- **PR7 Before Public.**
  - A privacy policy and terms of use.
  - Compliance with Google's API Services User Data Policy, including the Limited Use rules, which Google's OAuth verification checks.
  - A decision on whether a data protection impact assessment is needed.

### 6.5 Usability
- **U1 Design system (1a).** One set of components and design tokens (colour, spacing, type), documented in the repo.
- **U2 Responsive (1a).** Works from 320 px wide, in portrait and landscape. Breakpoints: phone under 640 px, tablet 640–1024 px, desktop above 1024 px.
- **U3 Feedback and recovery (1a).**
  - Every action shows its result.
  - Deleting a block or task, dropping a task, capturing a task, marking a task done and ending a series can be undone from a message shown for at least 10 seconds (15 seconds by default). Dropped tasks and deleted blocks can also be restored for 7 days afterwards (Must 6).
  - The Undo message meets WCAG 2.2.1 (timing adjustable):
    - its timer pauses while it has keyboard focus or the pointer is over it;
    - Ctrl+Z (Cmd+Z) undoes the latest action outside text fields, and in the empty capture field right after a save. In a field with typing to undo, it undoes the typing;
    - a setting keeps Undo messages until the user closes them, for at most 10 minutes;
    - actions made while a message is open are grouped into it, rather than stacked.
  - Confirmation dialogs are used only for delete all and the overlap warning (Must 1). Deleting a task type or a placeholder, and disconnecting Google Calendar, ask inline instead.
- **U4 Forms (1a).** Inline validation, autofill hints, and native input types for dates, times and numbers.
- **U5 Language (1a).** Plain language, using the terms in the glossary (section 4) consistently.
- **U6 Internationalization (1a).** English only, but ready for translation:
  - all UI text is kept in message files;
  - dates, times and numbers are shown in the user's locale format;
  - layouts use direction-neutral CSS, so right-to-left languages are possible later.
- **U7 Themes (1a).** Light and dark themes follow the system setting. A higher-contrast theme for the system "more contrast" setting is a Should.

### 6.6 Compatibility
- **C1 Browsers (1a).** The last two major versions of:
  - Chrome, Edge, Firefox and Safari on macOS and Windows;
  - Safari on iOS and iPadOS, in the browser and installed to the Home Screen;
  - Chrome on Android.
- **C2 Devices (1a).** Screens from 320 px wide. Input by touch, mouse, trackpad and keyboard.
- **C3 Graceful failure (1a).** If notifications, offline storage or Google Calendar are unavailable, creating, moving and confirming blocks still works.
- **C4 Testing (1a).**
  - End-to-end tests run on the Chromium, Firefox and WebKit engines in CI.
  - A manual check on a real iPhone and a real Android phone is done before each release.

### 6.7 Reliability and operations
- **R1 Availability (1a).** Best effort on free-tier hosting, with no uptime target. Uptime is monitored, and any outage longer than 1 hour is noted for the week-12 review. An uptime target is set before Public.
- **R2 Backups (1a).**
  - At most 24 hours of data can be lost (RPO), and service is restored within 1 day (RTO).
  - Backups are kept at most 30 days (Must 14).
  - A restore is tested before 1a and then every 3 months.
- **R3 Observability (1a).** Error tracking for client and server, structured logs, an uptime check, and real-user Core Web Vitals. The owner is alerted when:
  - errors spike;
  - the uptime check fails;
  - Google Calendar sync has not succeeded for 30 minutes.
- **R4 Delivery (1a).**
  - Every merge to the main branch is deployed automatically after CI passes.
  - Any deploy can be rolled back to the previous version within 15 minutes.
  - Database changes stay compatible with the previous app version, so a rollback needs no data change.
- **R5 Scale (Public).** Expected load is a few hundred users. Before Public, a load test at 10 times the expected peak must meet P3.
- **R6 Feature flags (1a).**
  - Every unfinished or risky feature ships behind a flag that is off by default in production, so unfinished work can be merged without being visible.
  - A flag can be set per environment and per user. A change takes effect within 1 minute, without a deploy.
  - Kill switches exist for the assistant, Google Calendar sync and notifications. When a flag is off, its feature is hidden and everything else keeps working (C3).
  - Each flag has a purpose and a removal date. A flag is removed within 90 days of being fully on.
  - Flag changes are written to the audit log (S7).

### 6.8 Quality and maintainability
- **Q1 Tests (1a).**
  - Unit, integration and end-to-end tests.
  - At least 90% line and branch coverage for the planning rules, the suggester, time handling and the metrics.
  - End-to-end tests for capture, schedule, confirm, reschedule, delete all and (1b) export.
- **Q2 Visual regression (1b).** Screenshot comparison for the day and week views.
- **Q3 Code quality (1a).**
  - Lint and strict type checks in CI.
  - Every pull request is reviewed, by the owner or by an AI review that the owner approves, and merges only when CI passes.
  - Architecture decisions are recorded in `docs/architecture.md`.
- **Q4 Analytics (1a).** Product analytics are the metric events in Must 15, first-party only. No third-party analytics.

### 6.9 Definition of Done
A Must is done when all of the following hold:
- its acceptance criteria pass, as automated tests wherever possible;
- CI is green: lint, types, unit, integration, end-to-end on three engines, and zero axe violations (A8);
- the performance budgets (P4) hold;
- there are no new high or critical dependency vulnerabilities (S6);
- its screens have empty, loading and error states, work by keyboard, and have all text in message files;
- the PRD and `docs/architecture.md` are updated if behavior or design changed.

### 6.10 Public website and SEO
The product has a public website that search engines index. The app itself stays invite-only: sign-in is limited to the allow-list, and multi-user support stays in Later. The website ships after Release 1b, once the product name and domain are chosen (section 10).
- **W1 Pages (Website).**
  - Home, features, and "how it works", which explains the evidence-based approach with sources and evidence ratings.
  - Privacy policy, terms of use, accessibility statement (A9), and "How the assistant works" (Must 13).
  - A sign-in link, and how to request an invite. Invite requests use an email link, not a form, so the website stores no personal data.
  - A blog is a Could.
- **W2 Rendering (Website).** Every public page is prerendered static HTML, so it can be read and indexed without JavaScript.
- **W3 SEO basics (Website).** Every page has:
  - a unique title and meta description;
  - Open Graph and social card tags;
  - a canonical URL and a clean, readable URL.
  
  The site also has a `sitemap.xml`, a `robots.txt`, and schema.org structured data (Organization, WebSite and SoftwareApplication).
- **W4 App not indexed (Website).** The app (sign-in and everything behind it) is marked `noindex` and blocked in `robots.txt`. Public pages never show user data.
- **W5 Quality (Website).** The website meets the same accessibility (6.1), performance (P1) and privacy (PR2: no tracking cookies) requirements as the app. Lighthouse scores at least 95 for SEO, accessibility and best practices on every page.
- **W6 Search tools (Website).** The site is verified in Google Search Console and Bing Webmaster Tools, the sitemap is submitted, and there are no crawl errors at launch.
- **W7 Honest claims (Website).** Claims match the evidence base and its ratings. There are no medical claims, and time blocking is not presented as proven (section 1).

### 6.11 Not applicable or deferred
- **Not applicable:**
  - HIPAA, SOC 2 and PCI-DSS, because there is no health or payment data.
  - Captions and transcripts, because the app has no audio or video.
- **Not needed at this scale:**
  - distributed tracing and multi-region hosting;
  - percentage-based staged rollouts, until Public (per-user flags are in R6).
- **Deferred:**
  - JAWS screen reader testing: later.
  - Right-to-left language testing: until such a language is added.
  - An uptime target, the penetration test and the load test: Public.

## 7. Platforms and sequence
Responsive web app first, then the mobile app, then the desktop app. All clients share one backend, so plans sync across devices. The architecture is decided separately.

## 8. Constraints and assumptions
- Google Calendar is the only required integration.
- Calendar access is read only in the first version. Planned blocks appear only inside the app, next to the imported Google events, so the app's own reminders are what keep the plan visible. The research behind the visual-calendar idea applies indirectly to an in-app calendar; this is an assumption to test with the owner's own data.
- To verify before Release 1a development starts (not yet checked):
  - whether Google requires OAuth verification for the calendar scope;
  - whether refresh tokens expire quickly while the app is in Google's "Testing" status;
  - whether web notifications on iOS Safari require a Home Screen install.
- Plan B for each check:
  - If Testing-status tokens expire (believed to be after 7 days), the OAuth app is published to production without verification. This is acceptable for personal use, with Google's warning screen.
  - If verification is required, it is done before Public.
  - If iOS needs a Home Screen install, installing the app becomes part of first-run setup on iPhone and iPad.
- The assistant is LLM-based. Data sent to the model is minimized, and the assistant is protected against prompt injection and follows the EU AI Act (Must 13).
- Time estimates come from the user's own history once enough data exists (5 confirmed blocks per task type).
- The planning fallacy research supports estimating from past durations; it is well replicated, but the evidence for time blocking itself is weak.
- The learning loop depends on the user confirming blocks. Unconfirmed blocks are excluded rather than assumed correct.
- Hosting uses free tiers to keep costs low (see `docs/architecture.md`), which is why section 6 sets best-effort availability and accepts slower first requests after idle time. Backups, retention and the protection of OAuth tokens are set in section 6.

## 9. Out of scope for the first version
Everything under "Later" in section 5, which means: mobile and desktop apps, guided planning view, automatic activity tracking, auto-replanning, write-back to Google Calendar, task imports, multi-user support, reliable background push, habit tracking beyond recurring tasks, and other calendar providers. The first version leaves these out to keep the first release small and testable by one user, and because some depend on decisions not yet made (architecture, LLM provider). The Should and Could items are not out of scope, but they are not part of "first version done" (see section 5): they follow the Musts, in the order listed, and get acceptance criteria when they are scheduled.

## 10. Open questions
Each item is owned by the owner (Nataly), and no decision date is set yet. The first three block the Musts shown.
- Which LLM provider to use, and its data policy (retention, training use). Blocks Must 13.
- Calendar dates for Release 1a and 1b. Blocks the measurement clock in section 3.
- The checks listed in section 8 (OAuth verification, token expiry, iOS notifications). Due before Release 1a development starts, with the plan B listed there. Blocks Release 1a.
- Product name and domain. Blocks the public website (section 6.10). Candidates so far: Second Draft, Strata (needs a modifier), Reckon. Kairo is rejected because of an existing day-planner app of that name.
- Approval of the architecture (`docs/architecture.md`, draft).
- The offline cache window (Release 1b), and fast capture while offline. Release 1a behavior without a connection is decided (Must 12).
- Who curates the evidence list, and its rating scale.
- Evidence gaps: Pomodoro and 52/17, chronotype, sleep, deep-work block length, weekly review rituals.
- Behavior not yet defined: notification deduplication across devices; the availability template's behavior when it conflicts with calendar events; limits on tasks, blocks and history length; the LLM cost cap and rate limit values; which languages to add after English; time-zone handling of imported events; what deleting a past unconfirmed block does to the confirmation rate.

## Changelog
- **v0.3 (2026-11-16, approved 2026-11-16):** decisions from design step 1, the user flows (`docs/design/01-user-flows/`).
  - **Closed open questions:** the first-run flow (Must 5, starter template) and what a block shows after its 7-day window (glossary, "Unconfirmed, window closed").
  - **Must 2:** a "To confirm" list plus inline confirmation, and a "Missed" label in 1a. The reschedule prompt stays a Should. Input limits for "it took X" and "partly done". Confirming a block moved on another device asks again. Confirming an old block of a done task never plans more work.
  - **Must 3:** declining calendar access, or skipping it, still signs in, and the calendar can be connected later.
  - **Must 5:** a starter template, and "Day off" clears work and focus time only.
  - **Must 6:** marking done removes future blocks and restores them on untick. Only unconfirmed blocks can be deleted. Task type delete asks inline, and "Other" cannot be deleted.
  - **Must 11:** when notification permission is asked.
  - **Must 12:** the exception to "later edit wins", 1a behavior without a connection, and sign-in when the session ends mid-task.
  - **Must 13:** a one-time data switch screen.
  - **Must 14:** typing "delete" to confirm delete all.
  - **Must 18:** ending a series can be undone.
  - **Section 6, U3:** a wider Undo list, with WCAG 2.2.1 timing, a Ctrl+Z rule, a setting and grouping. Inline confirmation for type, placeholder and calendar disconnect.
  - **Glossary and Should:** planning slots are normal blocks of "Plan: …" tasks counted in metrics, and detailed placeholders stay as linked summaries.
- **v0.2 (2026-11-05, approved 2026-11-05):** added Must 16 (accessibility, WCAG 2.2 AA) to Release 1a. Extended Must 13 from data minimization to assistant safety: prompt-injection resistance, approval of every change, own data only, safe replies, limits, and EU AI Act transparency and no-manipulation rules with a compliance check. Removed accessibility from the open questions. Added section 6, non-functional requirements (accessibility, performance, security, privacy, usability, compatibility, reliability, quality, Definition of Done), for use in the EU and US; later sections renumbered. Language decided: English, ready for translation. Added a public, search-indexed website after 1b, with the app staying invite-only (section 6.10), and in-house feature flags (R6). Extended Must 13 with:
  - trustworthy approval and grounded answers;
  - hidden-text cleaning;
  - chat history retention;
  - tool input limits, scope and wellbeing rules;
  - LLM provider requirements, oversight, and future data channels.

  Fixes from the second requirements review:
  - the overlap warning also covers creating a block and recovery buffers (Must 1);
  - the sign-in allow-list is a 1a criterion (Must 12);
  - the export list is complete (Must 14);
  - the residency wording is corrected (PR6);
  - terminology cleaned up (Musts 1, 2 and 3).

  Decisions from the second review:
  - postponements are counted once per miss, and a rescheduled block is the same block (glossary);
  - all undo and edit windows are 7 days, and the 30-day edit history is read-only (Musts 6 and 12, U3);
  - Must 11 moves to Release 1a and adds a notification when a block ends;
  - personal time and focus time are defined, and each task type uses work time, personal time or any time (glossary, Musts 5, 6 and 8);
  - the suggester plans selected tasks by their unscheduled time, with a final tie-breaker, 15-minute slots and defined splits (Must 8);
  - duration suggestions are per task, not per block (Must 10);
  - a load guardrail metric is added (section 3);
  - everything uses the home zone, and a rule is set for changing it (Must 12, glossary);
  - metric events carry the data needed to recompute every metric, and blocks get a frozen planned length (Must 15, section 3);
  - planning time counts active editing only (section 3);
  - the clock starts after 5 days of use in 7, and the review is held at the end of week 14 (section 3);
  - past unconfirmed blocks of a dropped or deleted task are marked "dropped" (Must 6);
  - confirmation-rate and early-move counting rules (section 3);
  - the hours-to-days conversion for urgency, and the dismissal reset (Must 4);
  - a due date and plan B for the Google and iOS checks (sections 8 and 10).

  Added Must 17 (checklists inside a task) and Must 18 (recurring tasks, fixed-time or flexible weekly targets) to Release 1b. Recurring tasks moved out of Later, and habit tracking beyond them stays in Later.

  Minor fixes: midnight and remainder edge cases (Must 2), the planned-vs-real summary, the prompt while the app is open, all-day, free and unanswered events (Must 3), back-to-back meetings (Must 9), undo of a drop (Must 6), scheduled share timing, the estimate-error week, P1 and P3 measurement, and a build-vs-adopt note (section 1).
- **v0.1 (2026-11-04):** approved.
