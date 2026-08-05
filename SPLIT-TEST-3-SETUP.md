# Split Test #3 — "Book Your Implementation Call" (Next Steps card 02)

PostHog setup reference. Everything here matches what is deployed in
`app/components/OnboardingFlow.tsx`. The strings must match exactly.

## What's being tested

Card 02 on the Next Steps page (page 4). Control keeps the VIP trial pitch;
the test arm reframes it as a free implementation call.

|  | Control | Test |
|---|---|---|
| Title | Try VIP Free for 3 Days | Book Your Implementation Call |
| CTA | See What It Includes → | Check Availability & Book |
| URL | `https://impactteam.us/trial` | booking link, depends on bucket |

Test-arm booking links, chosen by the page-1 avatar bucket:

| Bucket | Link | `booking_link` |
|---|---|---|
| `career_switcher` | `https://link.wifidesigned.com/widget/booking/SltNaIgVKshqbQn0uYvY` | `experienced` |
| `already_in_sales` | `https://link.wifidesigned.com/widget/booking/SltNaIgVKshqbQn0uYvY` | `experienced` |
| `new_to_workforce` | `https://link.wifidesigned.com/widget/booking/RiwZRIh5MTHPF3hfPO9U` | `new` |

**Goal:** demand for the calls, not bookings. Clicks on both links count together.

## Reference values

| Thing | Value |
|---|---|
| Experiment name | `Next Steps — Implementation Call copy (step 2)` |
| Feature flag key | `next-steps-call-copy-variant` |
| Variant keys | `control`, `test` |
| Rollout percent | `100` |
| Split | control `85` / test `15` |
| Participant type | Persons |
| Exposure event | `$feature_flag_called` (PostHog default) |
| localStorage key | `impact_next_steps_copy_variant` |

## Event properties

| Event | Property | Values |
|---|---|---|
| `onboarding_page_view` | `page_name` | `next_steps` |
| `onboarding_page_view` | `page` | `4` |
| `onboarding_page_view` | `variant` | `control` / `test` |
| `step_completed` | `step_key` | `discord` (card 01), `vip_trial` (card 02) |
| `step_completed` | `booking_link` | `experienced` / `new` — test arm card 02 only |
| `step_completed` | `variant` | `control` / `test` |
| `step_completed` | `all_completed` | `true` / `false` |
| `step_completed` | `bucket` | the page-1 avatar bucket |

`step_index` and `step_title` also exist but should not be used as filters —
`step_title` differs between arms, `step_index` breaks if cards are reordered.

## Setup

1. **Experiments → New experiment**
   - Name: `Next Steps — Implementation Call copy (step 2)`
   - Feature flag key: `next-steps-call-copy-variant`
   - Hypothesis: reframing card 02 as a free implementation call increases
     click-through on that card.

2. **Rollout & variants**
   - Rollout percent: `100`
   - Variant keys exactly `control` and `test` — the code compares against the
     literal string `"test"`, so any other casing or naming falls through to control.
   - Split: control `85`, test `15`. Must sum to 100.
   - PostHog will warn that equal splits are better. For a fixed test-arm
     exposure, 100% rollout with an uneven split beats a reduced rollout with an
     even split. 85/15 costs ~2x the runtime of 50/50; a reduced-rollout 50/50
     at the same 15% exposure would cost ~3.3x.
   - Do not rebalance the split mid-experiment — PostHog rehashes and users move
     between arms. If you might widen later, start wider.

3. **Primary metric** — Funnel, `Step 2 click rate (of page-4 viewers)`
   - Step 1: `onboarding_page_view` where `page_name` = `next_steps`
   - Step 2: `step_completed` where `step_key` = `vip_trial`
   - Conversion window: 7 days. This is per-person time from step 1 to step 2,
     not the analysis period. The click is in-session so almost all conversions
     happen in seconds; 7 days is headroom for return visits. Whatever you pick
     applies to both arms, so it cannot bias the comparison — it only shifts the
     absolute percentage.
   - Order: Sequential (**not** strict order)
   - Denominator is page-4 viewers, because a funnel only counts people who
     complete step 1. Both booking links count together here — that's the point.

4. **Secondary metric** — same step 1
   - Step 2: `step_completed` where `all_completed` = `true` — full completion rate.

   Optional, deliberately left out of the initial setup: step 2 =
   `step_completed` where `step_key` = `discord`. Card 02 is visible (dimmed)
   while locked, and card 01 must be clicked before card 02 unlocks, so a more
   compelling card 02 could raise Discord clicks. If the primary result is
   surprising, add this metric then — PostHog computes it retroactively over the
   whole experiment period, so nothing is lost by skipping it now.

5. **Save as draft. Do not launch.**

6. **Verify it's dark** — Feature Flags → `next-steps-call-copy-variant` →
   Enabled toggle **off**. That toggle is the real kill switch. Re-check after
   every deploy.

## Qualification rate (which booking link)

The experiment view compares variants; it does not break down within a variant.
Use a standalone insight:

- Insights → New → **Trends**
- Event: `step_completed`
- Filter: `step_key` = `vip_trial`
- Filter: `variant` = `test` (an **Event property**, not a feature flag)
- Breakdown by → **Event property** → `booking_link` — not "Event", which groups
  by event name and tells you nothing
- View as table or pie

Use the plain `variant` property rather than
`$feature/next-steps-call-copy-variant`. The `$feature/...` property is only
stamped on events while the flag is live, so it does not exist at all before
launch and cannot be selected. `variant` also records what the user was actually
shown, which is the truer attribution.

Baseline for comparison: same breakdown on `onboarding_page_view`
(`page_name` = `next_steps`) broken down by `bucket`. If experienced users are a
bigger share of clickers than of viewers, the offer is pulling qualified people.

## Launch checklist

1. Experiment → **Launch**
2. Confirm the flag flipped to Enabled at 85/15
3. Clear QA overrides on every browser you tested with — localStorage outranks
   PostHog and is sticky:
   ```js
   localStorage.removeItem("impact_next_steps_copy_variant");
   ```
4. Hard-refresh in a private window; console logs
   `[A/B test] next-steps-call-copy-variant exposure tracked:`
5. Activity → Live events: confirm `step_completed` carries `step_key`,
   `booking_link`, and `$feature/next-steps-call-copy-variant`

## QA notes

The app runs in a cross-origin iframe inside Whop. Console commands typed at the
`top` context write to `whop.com`'s localStorage, which the app never reads.
Use **DevTools → Application → Local Storage** and pick the app's origin, or the
postMessage helper from the top frame:

```js
document.querySelectorAll("iframe").forEach(f =>
  f.contentWindow.postMessage({type:"force-variant", flag:"next-steps-copy", variant:"test"}, "*")
);
```

To force the test arm on page 4 directly, set in the app's origin:
`impact_next_steps_copy_variant` = `test`, `impact_page` = `4`,
`impact_bucket` = `already_in_sales` (or `new_to_workforce`),
`impact_steps` = `[0]` (marks card 01 done so card 02 is clickable).

New properties only appear in PostHog dropdowns after at least one event carrying
them has been ingested.
