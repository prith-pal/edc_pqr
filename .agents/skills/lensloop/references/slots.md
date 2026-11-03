# Slots

Each phase is one slot: a skill, one or more agents, and a model for each agent.
The rule: a `feature_*_review_*` model family differs from the `feature_*_draft` family, so the two are less likely to share a blind spot. Today, only plan review meets it.

## Roster

This table is the single source of truth for models. Agent files hold none. Each phase reads its row, and stops if the row or its model is missing. To change a model, edit the row.

Built: `/lensloop plan review` runs on Kilo. Not built: the three `/lensloop impl review` workers below. Until they exist, that phase runs one Claude agent, on the same family as its drafter, so it is not yet decorrelated.

**Orchestrator:** the session that ran `/lensloop <phase> draft`. It runs the review and incorporates the feedback, so it should be steerable enough to accept findings and strong enough to judge them. If the drafting model is too weak for that, use a stronger model as the orchestrator. Every `feature_*_review_*` finding still gets a `RESOLVED` line: fixed, or rejected with evidence.

| Command | Agent | Harness | Model | Effort | Provider | Projected cost per run | Why |
|:--|:--|:--|:--|:--|:--|:--|:--|
| `/lensloop plan draft` | `feature_plan_draft` | Claude Code | `opus` | Session | Claude plan | Included in plan | The ticket's design decisions happen here |
| `/lensloop plan review` | `feature_plan_review_approval` | Kilo | `openrouter/openai/gpt-6.1-sol` | `max` | OpenRouter | ~$0.30–$1.30 (estimate) | A plan mistake spreads to every later phase, so the strongest reviewer goes here |
| `/lensloop impl draft` | `feature_impl_draft` | Claude Code | `sonnet` | Session | Claude plan | Included in plan | The approved plan has already made the big decisions |
| `/lensloop impl review` | `feature_impl_review_approval` | Kilo (not built) | `openrouter/z-ai/glm-5.3-flash` | `max` | OpenRouter | ~$0.03–$0.07 | A cheap, independent verdict |
| `/lensloop impl review` | `feature_impl_review_approval` | Kilo (not built) | `deepseek/deepseek-flash` | `max` | DeepSeek | ~$0.04 | A second cheap verdict from another family |
| `/lensloop impl review` | `feature_impl_review_comment` | Kilo (not built) | `openrouter/google/gemini-3.8-flash` | `high` | OpenRouter | ~$0.10 | Hypotheses only, with no vote. It adds a separate vantage, but tends to agree, so its agreement is ignored and each objection is checked |

| Projection | API spend |
|:--|:--|
| One ticket, one round per review | ~$0.47–$1.51 |
| One ticket, two rounds per review | ~$0.94–$3.02 |
| 30 tickets, one round per review | ~$14–$45 |

- The review costs come from a small number of local runs of similar review agents, so they show rough size only. The `glm-5.3-flash` figure was measured at high effort, so expect max to cost more.
- The `gpt-6.1-sol` figure is an estimate. Earlier measured runs used medium effort, at ~$0.18 per run.
- `feature_*_draft` costs assume a Claude plan. A harness that uses API keys pays per token instead.
- Models and providers can be swapped per slot, as long as a `feature_*_review_*` family differs from the `feature_*_draft` family.

## Verdict Rule for `/lensloop impl review` (not built yet)

| `feature_impl_review_*` results | Outcome |
|:--|:--|
| Same finding from 2+ families | Repair, ranked highest |
| Request changes from 2+ families, on different findings | Repair |
| Request changes from 1 family | Comment, surfaced to the human at merge |
| A `feature_impl_review_comment` objection | A hypothesis. The orchestrator checks it against the code. Confirmed with evidence: a finding. Otherwise: dropped |
| A `feature_impl_review_comment` agreement | No signal, and never counted |

The comment agent generates hypotheses and others adjudicate them. It cannot second a lone objection, because a noisy member could then turn a weak objection into a repair.
