# Split Test #2 — Control Variant (3-Step Next Steps Page)
# Result: LOST to test variant (2 steps, no course module card)
# Date: August 2026

## What this was:
- Control: 3 steps on the Next Steps page (page 4) — Join the Community / Watch the First Module / Try VIP Free for 3 Days
- Test (winner): same page with the "Watch the First Module" card removed → 2 steps
- Feature flag key: `next-steps-2-step-variant`
- localStorage key: `impact_next_steps_variant`
- Primary metric: `step_completed`
- Outcome: test won and was rolled out to 100% of users. Control code removed from production.

## Removed step object — `new_to_workforce` bucket

```ts
{
  title: "Watch the First Module",
  description:
    "You don't know what you don't know yet - and that's okay. This module breaks down how high-ticket sales actually works and exactly what separates reps who make $5k/mo from ones making $30k.",
  mobileDescription:
    "Go through your first module. In these trainings you will be mastering the sales script & questions. A great script is like a sword for a fighter.",
  cta: "Start Watching →",
  icon: "02",
  url: "https://whop.com/joined/impact-team-vip/impact-sales-course-wcqbjJXuoKEPWo/app/courses/cors_1NtY86gsAfkVYQNyAXEkXR/lessons/lesn_sk8SpvBD3szEw/",
},
```

## Removed step object — `career_switcher` bucket

```ts
{
  title: "Watch the First Module",
  description:
    "You're lucky getting into sales you don't have the bad habits built up. The reason most sales reps work for years never making real $ - is they never built the foundation. A great script is like a sword for a fighter.",
  mobileDescription:
    "Go through your first module. In these trainings you will be mastering the sales script & questions. A great script is like a sword for a fighter.",
  cta: "Start Watching →",
  icon: "02",
  url: "https://whop.com/joined/impact-team-vip/impact-sales-course-wcqbjJXuoKEPWo/app/courses/cors_1NtY86gsAfkVYQNyAXEkXR/lessons/lesn_sk8SpvBD3szEw/",
},
```

## Removed step object — `already_in_sales` bucket

```ts
{
  title: "Watch the First Module",
  description:
    "You've already taken sales calls. Yet the reason most sales reps work for years never making real $ - is they never built the foundation. A great script is like a sword for a fighter.",
  mobileDescription:
    "Go through your first module. In these trainings you will be mastering the sales script & questions. A great script is like a sword for a fighter.",
  cta: "Start Watching →",
  icon: "02",
  url: "https://whop.com/joined/impact-team-vip/impact-sales-course-wcqbjJXuoKEPWo/app/courses/cors_1NtY86gsAfkVYQNyAXEkXR/lessons/lesn_sk8SpvBD3szEw/",
},
```

## Course module URL (removed from production)

```
https://whop.com/joined/impact-team-vip/impact-sales-course-wcqbjJXuoKEPWo/app/courses/cors_1NtY86gsAfkVYQNyAXEkXR/lessons/lesn_sk8SpvBD3szEw/
```

## A/B test code that was used (PostHog feature flag)

```tsx
const [nextStepsVariant, setNextStepsVariant] = useState<"control" | "test">("control");

// ─── PostHog: A/B test — next steps 2 vs 3 layout ────────────────
useEffect(() => {
  const saved = safeGetItem("impact_next_steps_variant");
  if (saved === "test" || saved === "control") {
    setNextStepsVariant(saved);
    return;
  }

  let hasFired = false;
  const checkFlag = () => {
    if (hasFired) return;
    const variant = posthog.getFeatureFlag("next-steps-2-step-variant");
    if (variant === undefined) return;
    hasFired = true;
    const v = variant === "test" ? "test" : "control";
    setNextStepsVariant(v);
    safeSetItem("impact_next_steps_variant", v);
  };
  checkFlag();
  posthog.onFeatureFlags(checkFlag);
}, []);

// ─── PostHog: Register experiment exposure (only for new users) ──
useEffect(() => {
  const saved = safeGetItem("impact_next_steps_variant");
  if (saved === "test" || saved === "control") return;

  const trackExposure = () => {
    const variant = posthog.getFeatureFlag("next-steps-2-step-variant");
    if (variant !== undefined) {
      console.log("[A/B test] next-steps-2-step-variant exposure tracked:", variant);
    }
  };
  trackExposure();
  posthog.onFeatureFlags(trackExposure);
}, []);
```

## Variant-conditional rendering that was used (in `NextStepsPage`)

```tsx
const baseSteps = nextStepsMap[selectedBucket || "new_to_workforce"];
const steps = (nextStepsVariant === "test"
  ? baseSteps.filter((s) => s.title !== "Watch the First Module")
  : baseSteps
).map((s, idx) => ({ ...s, icon: String(idx + 1).padStart(2, "0") }));
```

## Known issue with this pattern (fixed in split test #3)

`getFeatureFlag` returns `false` — not `undefined` — for a flag that exists but is disabled, or for a
user not in the rollout. The code above treats that as `"control"` and writes it to localStorage
permanently, so anyone who visited while the flag was off could never be assigned to the test later.
Split test #3 guards the write with `if (typeof variant !== "string") return;`.
