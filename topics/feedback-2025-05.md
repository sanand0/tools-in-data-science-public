# May 2025 Feedback

Based on feedback from 33 students, via [ChatGPT](https://chatgpt.com/share/68cba081-afc0-800c-9da3-75222e84a499).

## Insights

- ⭐ **“Time-pressure” complainers actually rated ROE slightly _higher_.**
  Students who mentioned ROE time limits gave ROE **2.61** vs **2.33** for others (**+0.28**). This suggests the most engaged cohort both _feels_ the time squeeze and still perceives value—hinting the exam is closer to a “desirable difficulty” than a pure frustration. (Concept supported by learning-science literature on “desirable difficulties”.) ([bjorklab.psych.ucla.edu][1])
- **Project-2 is love-it or hate-it.**
  Median is **5/5** with many top scores, but variance is highest (σ≈1.54). Those flagging “difficulty/prereqs” rated P2 **1.32 points lower** than others—so P2 is excellent for prepared learners and punishing for under-prepared ones (bimodal fit).
- **Calling out TA/Discourse correlates with _higher_ satisfaction.**
  Mentions of TA/Discourse associate with slightly higher ratings across all four metrics (Δ overall **+0.08**, P1 **+0.15**, P2 **+0.32**, ROE **+0.05**). That’s counter to the intuition that “more TA talk = more complaints”; it reads as “the engaged students leaned on Discourse and benefited.”
- **Students know it’s hard—and still rate learning high.**
  Despite many “hard/fast” comments, overall learning is strong (\~**4.0/5**). That aligns with the course’s stated design (“ROE is hard”; “programming skills are a pre-requisite”), and suggests difficulty didn’t suppress perceived learning.
- **“Alignment” is a minority complaint—but a leverage point.**
  Only a few explicitly said “align projects/ROE with taught content,” yet those who did had lower ROE ratings (−0.57) and overall learning (−0.47). A small group may be disproportionately dissatisfied due to scope drift.

## Interesting observations

- **ROE dominates the pain map.** Time limit (45 min per the schedule), ambiguity, and “what exactly are we proving?” recur. A few ask for mock portals and clearer rubric.
- **P2 teaches beyond comfort.** Many “pushes us beyond” / “real-world exposure” notes in “Best things,” while the “Worst” ask for more scaffolding. Classic split between stretch vs support.
- **Ops gaps show up:** evaluation delays; release/schedule slips; a few network/portal reliability mentions; form UX complaints (Google Form structure).
- **Tooling friction:** requests for dependable GPT/AI-Pipe access and deployment help; some struggled with “free versions” / rate limits. (AI-Pipe is in your ecosystem.)
- **Students explicitly ask for “instant feedback”** on submissions (linting/auto-checks), not just grades—hinting appetite for continuous formative signals.
- **A minority asks for _tougher projects_ (and longer ROE).** The tails want even more challenge/time—a useful signal for differentiated tracks.
- **Desire for predictable cadence** (earlier release, stick to schedule) appears in multiple corners even if counts are lower; these often co-occur with lower satisfaction.

## Actions

1. **Gate early with a hard readiness check + branching track.**
   Make GA-1 (already linked) the _gate_:
   - **If GA-1 < threshold:** auto-route to a “Foundation track” of P2 (same outcomes, more scaffolds, smaller surface area).
   - **If GA-1 ≥ threshold:** “Pro track” (current P2).
     Rationale: removes P2 bimodality; keeps challenge for prepared students; respects “desirable difficulty” while preventing wipeouts. Implementation is trivial (routing by score in your existing exam infra).
2. **ROE redesign: keep pressure, fix _friction_.**
   - Keep 45-min “pressure-cooker” (it likely drives durable learning), _but_ reduce non-constructive friction:
     - **Two 10-min micro-mocks** in the exact ROE environment the week prior (auto-graded, unlimited retries).
     - **Stable prompt rubric** with 2–3 canonical “what good looks like” exemplars.
     - **Network-independent tasks** (bundle data; pre-cache assets) and a simple “connectivity hiccup” auto-extend of 3–5 min if the portal detects time-outs. ([bjorklab.psych.ucla.edu][1])
3. **TA/Discourse “SLA + Triage Bot.”**
   - Publish an SLA (e.g., TA initial touch <6 h, resolution <24 h).
   - Add a **Discourse clarifier bot** that: (i) de-dupes to canonical answers; (ii) proposes clearer wording for confusing prompts; (iii) tags to the right TA. (Start with a rules-only bot; graduate to LLM summaries later.) This leans into the positive correlation you’re already seeing.
4. **Instant feedback everywhere.**
   - Add pre-submission checks: schema validators, smoke tests, minimal unit tests for projects; “red/green” badges on submit.
   - For P2, expose a _thin_ public checker (5–10 hidden tests retained for grading).
5. **Cadence discipline via CI.**
   Turn “release on time” from a promise into automation: a release calendar in the repo, GitHub Actions that publish content at fixed timestamps, and an **automated grading queue dashboard** (counts, average turnaround, SLA breaches).
6. **Tooling reliability: AI-Pipe + deployment helpers.**
   - Provide a one-click “fallback” API key via AI-Pipe with rate-limit hints and a local stub; publish **two minimal deployment recipes** (Vercel/Cloudflare) with a pre-flight checklist. (Your repo already points to AI-Pipe.)
7. **Micro-scaffolds for P2 only (don’t blunt the challenge).**
   Ship _optional_ scaffolds: sample input/output pairs, data dictionaries, 2 starter snippets. These trim unproductive thrash while preserving the tough core.
8. **Rubric transparency + sample graded artifacts.**
   Post 2 anonymized “A/B/C” exemplars with rubric mapping; students asked for “what exactly are we proving?” — this answers that.

Contrarian take:

- **Do _not_ extend ROE time by default.** Keep pressure (the signal is that time-pressure complainers still saw value). Instead, reduce non-learning friction (mocks, rubric, offline data) and add a tiny auto-extend only on genuine timeouts. ([bjorklab.psych.ucla.edu][1])
- **Don’t make P2 uniformly easier.** Split tracks. The top tail explicitly wants tougher projects; novices need scaffolds.

Why these are likely to work:

- The course intentionally sets difficulty and prereqs; students echo this. Aligning _tracks_ with the stated prereqs preserves the course’s identity and reduces avoidable attrition.
- “Desirable difficulty” predicts your pattern: short-term pain (complaints about time/hardness) with high perceived learning and better transfer if friction is managed. ([bjorklab.psych.ucla.edu][1])

## Evidence

- **Theme prevalence** (share of students mentioning): ROE time **73%**, TA/Discourse **64%**, difficulty/prereqs **33%**, evaluation delays **27%**, GPT/AI-Pipe access **24%**.
- **Project-2 split:** students citing “difficulty/prereqs” rate P2 **1.32** lower than others; P2 median **5** despite that.
- **TA/Discourse ↗ learning:** small but consistent upticks across metrics when TA/Discourse is mentioned.
- **Scheduling & evaluation:** smaller count, but the subgroup has lower satisfaction—an ops fix with outsized payoff.

## Citations for context (not from student data)

- Course page & design (hard ROE; prereqs; schedule with 45-min ROE): GitHub README and links therein.
- Learning science on “desirable difficulties”: Bjork & Bjork, overviews and reviews. ([bjorklab.psych.ucla.edu][1])

[1]: https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/04/EBjork_RBjork_2011.pdf "Creating Desirable Difficulties to Enhance Learning"
