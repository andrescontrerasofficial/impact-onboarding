# Split Test #1 — Control Variant (Welcome Page First)
# Result: LOST to test variant (no welcome page)
# Date: March 2026

## What this was:
- Control: 5-page flow starting with a welcome/splash page (page 1)
- Test (winner): 4-page flow skipping welcome, starting on avatar selection
- Feature flag key: `onboarding-variant`
- Primary metric: `bucket_confirmed`

## Welcome Page Component (removed from production)

```tsx
const WelcomePage = () => {
  const firstName = userName || null;
  return (
    <div className="welcome-container min-h-[100dvh] flex flex-col items-center justify-center px-6 pt-12 md:pt-0 text-center">
      <div
        className={`max-w-lg transition-all duration-500 ${
          animateIn
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        <div style={anim("fadeSlideDown", 0)} className="welcome-logo mx-auto mb-6 flex items-center justify-center">
          <div
            className="relative inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-brand-orange/15 to-brand-orange/5 border border-brand-orange/20"
            style={{ boxShadow: "0 0 40px rgba(250, 70, 22, 0.12), 0 0 0 1px rgba(250, 70, 22, 0.06)" }}
          >
            <img src="/original-logo.svg" alt="The Impact Team" className="logo-img h-8 w-8 object-contain" />
          </div>
        </div>

        {firstName && (
          <p style={anim("fadeSlideUp", 0.1)} className="welcome-greeting text-[var(--c-muted)] text-xl mb-3">Hey, {firstName}.</p>
        )}

        <h1 style={anim("fadeSlideUp", 0.18)} className="welcome-heading text-5xl md:text-6xl font-extrabold text-[var(--c-heading)] tracking-tight mb-4 leading-tight">
          Welcome to
          <br />
          <span className="text-brand-orange">The Impact Team.</span>
        </h1>

        <p style={anim("fadeSlideUp", 0.3)} className="welcome-subtitle text-[var(--c-muted)] text-lg mb-10 leading-relaxed">
          Learn how to close high-ticket deals with a simple formula.
        </p>

        <button
          style={anim("fadeSlideUp", 0.42)}
          onClick={() => goToPage(2)}
          className="btn-pulse cta-button text-white font-semibold text-lg px-10 py-4 rounded-xl"
        >
          Let&apos;s go. Takes 90 sec. →
        </button>

        <div style={anim("fadeSlideUp", 0.54)} className="welcome-social mt-8">
          <img src="/dark.png"  alt="Social proof" className="social-proof-dark  w-full max-w-xs mx-auto opacity-90" />
          <img src="/light.png" alt="Social proof" className="social-proof-light w-full max-w-xs mx-auto opacity-90" />
        </div>
      </div>
    </div>
  );
};
```

## Control variant avatar page header (different from test winner)
```tsx
<h2 className="text-3xl md:text-4xl font-extrabold text-[var(--c-heading)] mb-3">
  Tailor your <span className="text-brand-orange">experience.</span>
</h2>
<p className="text-[var(--c-subheader)] text-lg">
  Before we open the gates, tell us who you are so we can tailor the <span className="text-brand-orange">blueprint</span>.
</p>
```

## A/B test code that was used (PostHog feature flag)
```tsx
// skipWelcome state + localStorage persistence
const [skipWelcome, setSkipWelcome] = useState(false);

// Experiment effect
useEffect(() => {
  if (safeGetItem("impact_skip_welcome") === "true") return;
  const savedPage = safeGetItem("impact_page");
  if (savedPage && parseInt(savedPage) > 1) return;

  let hasFired = false;
  const checkFlag = () => {
    if (hasFired) return;
    const variant = posthog.getFeatureFlag("onboarding-variant");
    if (variant === undefined) return;
    hasFired = true;
    posthog.capture("experiment_variant_assigned", {
      experiment: "onboarding-variant",
      variant: variant || "control",
    });
    if (variant === "test") {
      setSkipWelcome(true);
      setCurrentPage(2);
    }
  };
  checkFlag();
  posthog.onFeatureFlags(checkFlag);
}, []);
```
