# Impact Team Onboarding App — Context & Implementation Notes

## Project Overview

This is a Next.js 16 onboarding flow for "The Impact Team," a free sales training community on Whop. The app runs inside a Whop iframe and guides new members through onboarding before they access the community. It's deployed at impact-onboarding.vercel.app.

**Tech stack:** Next.js App Router, TypeScript, Tailwind CSS, Whop iframe SDK
**Repo:** https://github.com/andrescontrerasofficial/impact-onboarding

## Brand System

- Primary orange: `#FA4616`
- Dark background: `#141212`
- Cream/light: `#FCF6F5`
- Font: Plus Jakarta Sans
- Aesthetic: dark, bold, high-energy sales community vibe

## Current Flow (5 pages)

1. **Welcome** — intro splash
2. **VSL + Testimonials** — video sales letter with social proof
3. **Avatar Selection** — user picks their bucket (🌱 beginner, 🔄 career switcher, 🔥 existing salesperson)
4. **Features Overview** — what's inside the community
5. **Personalized Next Steps** — tailored CTA based on avatar selection

GHL webhook integration is working — avatar selection data gets sent to GoHighLevel.

---

## Changes To Implement

### 1. Reorder Pages (HIGH PRIORITY)

Move avatar selection earlier to capture lead data before the video (where drop-off is highest).

**New flow:**
1. Welcome
2. Avatar Selection (was page 3)
3. VSL + Testimonials (personalized based on avatar if possible)
4. Personalized Next Steps
5. Features Overview (optional/skippable)

**Why:** Research shows early self-selection increases retention by 50% and users who pick a path show 3x higher conversion. Capturing the bucket before the video means we get the data even if they drop off during the VSL.

**Implementation:** Reorder components in `OnboardingFlow.tsx`. The avatar state is already managed there and passed down, so moving the component order should be straightforward.

### 2. Replace Emoji Icons with Custom Branded Imagery (HIGH PRIORITY)

Current avatar cards use emoji (🌱🔄🔥) and feature cards use emoji (📚💼🎯). Replace these with proper branded images/illustrations that match the dark + orange aesthetic.

**Options for style direction:**
- Dark photography with orange overlays/accents
- Minimalist line illustrations in brand orange on dark bg
- Abstract geometric shapes/gradients
- Hybrid (photo backgrounds with illustrated overlays)

**Files affected:** Avatar selection component, features overview component, `/public/images/`

### 3. Add Progress Indicator (MEDIUM PRIORITY)

Add a visual "Step X of Y" progress bar at the top of each page. Research shows progress indicators increase completion rates significantly (62% higher engagement).

**Implementation:** Create a new `ProgressBar.tsx` component, render it in `OnboardingFlow.tsx` above the current page content. Style it with the brand orange.

### 4. Add Micro-Interactions & Animations (MEDIUM PRIORITY)

- Page transitions: fade/slide between steps (200-300ms)
- Avatar card hover states and selection feedback
- Button click feedback
- Checkmark/celebration on avatar selection ("Welcome to the [bucket] crew!")
- Final page celebration (confetti or similar)

**Recommended library:** Framer Motion (for page transitions, scale effects, stagger animations). Optional: react-confetti for completion celebration.

### 5. Optimize Features Page (LOW PRIORITY)

Consider making the features page optional/skippable, or converting it to post-onboarding tooltips. The goal is reducing friction — don't force people through info they can discover later.

### 6. Personalize Content Based on Avatar (LOW PRIORITY)

Once avatar selection is page 2, downstream pages can adapt:
- Show different testimonials based on bucket
- Customize next steps messaging per bucket
- Adjust headline copy to speak to their specific situation

---

## Research Highlights (2025 Onboarding Best Practices)

- Bad onboarding causes up to 80% app abandonment before first use
- Good onboarding increases retention by up to 50%
- Progressive disclosure > info dumping — show features contextually
- "Time to value" is the key metric — how fast do users feel the product is worth it
- Early personalization (self-selection) is the single highest-impact pattern
- Gamification that works: progress bars, early wins, milestone celebrations
- Animation sweet spot: 200-300ms, purposeful not decorative
- Community-specific: achievement paths, "new member" quick wins, clear 30-day roadmap
- Dark themes with accent colors are trending for premium/high-energy brands
- Custom branded imagery >>> generic emoji for trust and perceived quality

## Key Files

- `/app/components/OnboardingFlow.tsx` — main flow logic, page ordering, state management
- `/app/globals.css` — global styles, brand tokens
- `/public/images/` — static assets (needs new branded images)
- Whop iframe SDK handles auth and embedding context