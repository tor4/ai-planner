# Evidence base for planning and productivity advice

Date: 2026-10-30. First pass, from web searches. Most of it comes from secondary coverage, and the primary papers still need to be read before any claim goes into the app as advice.

Each finding carries an evidence rating:
- **Strong**: meta-analysis or several replications.
- **Moderate**: solid primary studies, narrower scope or some replication doubt.
- **Weak**: a small study, or practitioner advice without experiments.

## 1. Breaks between meetings (recovery buffers)

| Finding | Evidence | Source |
|---|---|---|
| Microsoft Human Factors Lab (2021): 14 people wore EEG across back-to-back vs. broken-up video meetings. Without breaks, a stress marker (beta activity) kept rising. With 10-minute breaks it dropped. Task transitions caused spikes. | Weak (n=14, secondhand reports only, original report not found) | https://www.silicon.co.uk/e-management/jobs/microsoft-study-human-brain-needs-break-395269 |
| Albulescu et al. (2022, PLOS ONE): meta-analysis of 22 samples (N=2,335). Micro-breaks of 10 minutes or less give small gains in vigor (d=.36) and less fatigue (d=.35). Performance effect is not significant (d=.16, p=.116). Gains in performance show only for low-demand tasks, and longer breaks help more. | Strong for wellbeing, weak for performance | https://pubmed.ncbi.nlm.nih.gov/36044424/ |
| There is no agreed optimal break length. Recovery from very demanding work may need more than 10 minutes (a hypothesis, not tested). | Open question | same as above |

Unverified, so do not use: one site claims "7-15 minutes to baseline" and "40% attention drop after 90 minutes" with no study cited.

**Implication:** a default buffer of about 5-10 minutes after a meeting is defensible, shown as "research suggests", not as a rule. Make it user-adjustable. The app can also measure the user's own recovery (what happens in blocks that follow long meetings) and learn from it.

## 2. Estimating how long tasks take (planning fallacy)

| Finding | Evidence | Source |
|---|---|---|
| Kahneman and Tversky (1979) named the planning fallacy. Buehler, Griffin and Ross (1994) showed it for task completion times: only about 45% of students finished by their own predicted time, and they stayed optimistic even after past overruns. | Strong (well replicated) | https://spsp.org/news-center/blog/buehler-planning-fallacy |
| Reference class forecasting (the "outside view"): estimate from the actual durations of similar past tasks, not from the details of this task. | Moderate (strong in large projects, less tested for personal tasks) | https://www.pmi.org/learning/library/planning-fallacy-causes-solutions-project-expectations-6374 |
| The causes are debated (inside view vs. wishful thinking). Some work questions how universal the effect is. | Open question | same as above |

**Implication:** this is the scientific basis for the app's duration suggestions. The app records real durations by task type, then suggests an estimate from the user's own past data. Primary papers to read next: Buehler, Griffin & Ross (1994); Lovallo & Kahneman (2003); Buehler, Griffin & Peetz (2010).

## 3. Urgent vs. important

| Finding | Evidence | Source |
|---|---|---|
| Zhu, Yang and Hsee (2018, Journal of Consumer Research): the "mere urgency effect". People choose urgent tasks with lower payoffs over important tasks with higher payoffs. It is stronger in people who see themselves as busy, and weaker when payoffs are made visible at the moment of choice. | Moderate (one thesis found it attenuates after controlling for confounds but still holds) | https://hub.jhu.edu/2018/05/31/meeting-deadlines-time-management-behaviors |

**Implication:** when the user plans a day, the app can show each task's payoff or goal next to its deadline, since reminding people of payoffs reduced the effect. The Eisenhower-style task types serve this purpose.

## 4. Task switching and "when and where" plans

| Finding | Evidence | Source |
|---|---|---|
| Leroy (2009): "attention residue". After switching tasks, thoughts about the previous task remain and hurt performance on the next one, mostly when the first task was unfinished. | Moderate (a well-cited experimental study) | https://econpapers.repec.org/RePEc:eee:jobhdp:v:109:y:2009:i:2:p:168-181 |
| Leroy and Glomb: writing a short note on where you stopped and what you will do next reduces the residue. | Moderate (a follow-up, not yet independently checked here) | https://www.uwb.edu/business/faculty/sleroy/attention-residue |
| Gollwitzer and Sheeran (2006): implementation intentions ("when X happens, I will do Y") raise goal attainment, d=.65 across 94 tests. | Strong | https://stafforini.com/works/gollwitzer-2006-implementation-intentions-and/ |
| Time blocking: only practitioner advice (Cal Newport's *Deep Work*) turned up. No experiment testing it was found. | Weak | n/a |

**Implication:** the confirm step can include a one-line "where I stopped and what's next" note. The app can also be honest that time blocking is popular but lacks direct experimental support.

## 5. Breaks during the work, and vacations

| Finding | Evidence | Source |
|---|---|---|
| De Bloom et al. (2009 meta-analysis; later updates): vacations improve wellbeing (d=+0.43), but the gain fades within about the first week after returning to work (d=-0.38). A 13-study update (N=1,428) found no benefit left after the first week and no extra gain from longer vacations. The authors suggest regular short vacations spread through the year. | Moderate-strong for wellbeing, nothing on productivity | https://www.jstage.jst.go.jp/article/joh/51/1/51_K8004/_article |

**Implication:** the year view can show how rest is spread across the year. "Several shorter breaks" is defensible, but the evidence is about wellbeing, not output, and the app should say that.

## Gaps (not found yet, so no advice from these)
- Pomodoro and 52/17 work-rest ratios.
- Chronotype and scheduling by time of day.
- Sleep.
- Deep-work block length.
- Weekly planning and review rituals.
- Evidence on how effective LLM planning assistants are.

## Rules for advice in the app
1. Each tip links to its source and shows an evidence rating.
2. Advice comes from this curated list, not from the model's memory.
3. Wellbeing guidance only, never medical advice.
4. Tips say "research suggests" and give the effect's size where known.
5. The app prefers the user's own data over population averages once enough history exists.
