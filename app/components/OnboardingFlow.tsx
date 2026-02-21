"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────
type Bucket = "new_to_workforce" | "career_switcher" | "already_in_sales" | null;

interface OnboardingFlowProps {
  experienceId: string;
  userId: string;
  userName: string;
  userEmail: string;
}

// ─── Testimonial Data ───────────────────────────────────────────────
// TODO: Replace these with your real testimonials
const testimonials = [
  {
    name: "Marcus J.",
    role: "Now earning $12k/mo in SaaS sales",
    quote:
      "I was broke and clueless about sales 6 months ago. This community changed my entire trajectory. The training is real — not some motivational fluff.",
    avatar: "MJ",
  },
  {
    name: "Daniela R.",
    role: "Went from retail to tech sales in 90 days",
    quote:
      "I was working retail making $15/hr. Joined the Impact Team, followed the roadmap, and landed a $65k base + commission role within 3 months.",
    avatar: "DR",
  },
  {
    name: "Jaylen T.",
    role: "Closed $280k in his first year",
    quote:
      "The frameworks in here are elite. I went from nervous on cold calls to consistently hitting 150% of quota. This isn't just a community — it's a cheat code.",
    avatar: "JT",
  },
  {
    name: "Sophia M.",
    role: "Promoted to team lead in 8 months",
    quote:
      "I already had sales experience but was stuck. The advanced modules and the people in here pushed me to another level. Got promoted faster than anyone at my company.",
    avatar: "SM",
  },
  {
    name: "Chris L.",
    role: "Built a 6-figure remote sales career",
    quote:
      "Quit my 9-to-5, went full remote sales. The playbooks and live coaching calls are worth 100x what I paid. Best decision of my life.",
    avatar: "CL",
  },
  {
    name: "Aaliyah K.",
    role: "From $0 to $8k/mo in 4 months",
    quote:
      "I had zero experience in sales — never even had a real job. This community took me from nothing to making more than both my parents combined.",
    avatar: "AK",
  },
];

// ─── Feature Data ───────────────────────────────────────────────────
// TODO: Replace these with your actual features and demo video URLs
const features = [
  {
    title: "Sales Mastery Course",
    description: "Complete A-to-Z sales training from prospecting to closing",
    icon: "📚",
    // TODO: Replace with your actual demo video URL
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "Live Coaching Calls",
    description: "Weekly group coaching sessions with real role-play practice",
    icon: "🎙️",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "Script Vault",
    description:
      "Proven cold call, email, and DM scripts that actually convert",
    icon: "📝",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "Deal Review Sessions",
    description:
      "Submit your live deals and get tactical feedback from top closers",
    icon: "🎯",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "Community & Networking",
    description: "Connect with thousands of hungry salespeople on the same path",
    icon: "🤝",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "Job Board & Referrals",
    description: "Exclusive sales job listings and warm intro opportunities",
    icon: "💼",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

// ─── Next Steps Data (conditional on bucket) ────────────────────────
// TODO: Replace these with your actual next steps for each bucket
// ─── REPLACEMENT #1: Replace the entire nextStepsMap (around line 100) with this ───

const nextStepsMap: Record<
  string,
  { title: string; description: string; cta: string; icon: string }[]
> = {
  new_to_workforce: [
    {
      title: "[Join the Community]",
      description:
        "Your first step: get inside the group, introduce yourself, and connect with people on the same path.",
      cta: "Join Now →",
      icon: "01",
    },
    {
      title: "[Watch Sales 101]",
      description:
        "Start with the fundamentals — learn what sales actually is, why it pays more than almost anything else, and how the game works.",
      cta: "Watch Now →",
      icon: "02",
    },
    {
      title: "[Complete the Cold Call Starter Kit]",
      description:
        "This 30-minute module gives you your first script, teaches you tonality basics, and gets you ready to make your first 10 calls.",
      cta: "Start Module →",
      icon: "03",
    },
    {
      title: "[Attend a Live Coaching Call]",
      description:
        "Nothing accelerates learning faster than watching real reps get coached in real time. Jump on this week's session and absorb everything.",
      cta: "See Schedule →",
      icon: "04",
    },
  ],
  career_switcher: [
    {
      title: "[Join the Community]",
      description:
        "Your first step: get inside the group, introduce yourself, and let people know what industry you're coming from.",
      cta: "Join Now →",
      icon: "01",
    },
    {
      title: "[Watch the Career Transition Roadmap]",
      description:
        "This module is built specifically for people switching industries. It maps your existing skills to sales and shows you the fastest path to getting hired.",
      cta: "Watch Now →",
      icon: "02",
    },
    {
      title: "[Browse the Job Board]",
      description:
        "We have exclusive SDR and AE listings from companies that specifically hire career switchers. Some of these never get posted publicly.",
      cta: "View Jobs →",
      icon: "03",
    },
    {
      title: "[Book a Strategy Session]",
      description:
        "Our team will help you build a personalized 90-day plan to break into sales based on your background, location, and goals.",
      cta: "Book Now →",
      icon: "04",
    },
  ],
  already_in_sales: [
    {
      title: "[Join the Community]",
      description:
        "Get inside the group and connect with other top performers who are grinding just as hard as you.",
      cta: "Join Now →",
      icon: "01",
    },
    {
      title: "[Start the Advanced Closing Module]",
      description:
        "Skip the basics — this covers multi-threading, executive selling, complex deal navigation, and techniques that 99% of reps never learn.",
      cta: "Watch Now →",
      icon: "02",
    },
    {
      title: "[Access the Software]",
      description:
        "Set up your tools, plug in the frameworks, and get your pipeline dialed in with our proven systems.",
      cta: "Open Software →",
      icon: "03",
    },
    {
      title: "[Submit a Deal for Review]",
      description:
        "Got a deal you're working? Submit it to the review board and get tactical feedback from closers who've been in your exact situation.",
      cta: "Submit Deal →",
      icon: "04",
    },
  ],
};

// ─── Main Component ─────────────────────────────────────────────────
export default function OnboardingFlow({
  experienceId,
  userId,
  userName,
  userEmail,
}: OnboardingFlowProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBucket, setSelectedBucket] = useState<Bucket>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(true);

  const totalPages = 5;

  // Page transition handler
  const goToPage = useCallback(
    (page: number) => {
      setAnimateIn(false);
      setTimeout(() => {
        setCurrentPage(page);
        setAnimateIn(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 200);
    },
    []
  );

  // Loading screen between page 4 → 5
  const startLoadingTransition = useCallback(() => {
    setIsLoading(true);
    setLoadingProgress(0);

    const loadingMessages = [
      "analyzing your profile...",
      "mapping your experience level...",
      "building your personalized roadmap...",
      "selecting the best resources for you...",
      "finalizing your plan...",
    ];

    let messageIndex = 0;
    setLoadingText(loadingMessages[0]);

    const messageInterval = setInterval(() => {
      messageIndex++;
      if (messageIndex < loadingMessages.length) {
        setLoadingText(loadingMessages[messageIndex]);
      }
    }, 700);

    // Animate progress
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 70);

    // Transition to page 5 after loading completes
    setTimeout(() => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      setLoadingProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        goToPage(5);
      }, 400);
    }, 3800);
  }, [goToPage]);

  // Send bucket selection to GHL
  const tagLeadInGHL = useCallback(
    async (bucket: string) => {
      try {
        await fetch("/api/tag-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userName,
            email: userEmail,
            bucket: bucket,
            whopUserId: userId,
          }),
        });
      } catch (error) {
        console.error("Failed to tag lead:", error);
        // Don't block the user's flow if this fails
      }
    },
    [userName, userEmail, userId]
  );

  // Handle bucket selection + GHL tagging
  const handleBucketSelect = useCallback(
    async (bucket: Bucket) => {
      setSelectedBucket(bucket);
      if (bucket) {
        await tagLeadInGHL(bucket);
      }
    },
    [tagLeadInGHL]
  );

  // ─── Step Indicator ─────────────────────────────────────────
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 py-6">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`step-dot w-2 h-2 rounded-full transition-all duration-300 ${
            step === currentPage
              ? "active w-6"
              : step < currentPage
              ? "completed"
              : "bg-[#262626]"
          }`}
        />
      ))}
    </div>
  );

  // ─── PAGE 1: Welcome ────────────────────────────────────────
  const WelcomePage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div
        className={`max-w-lg transition-all duration-500 ${
          animateIn
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        {/* Subtle brand mark */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-brand-orange/20 flex items-center justify-center mx-auto mb-8">
          <span className="text-brand-orange text-2xl font-bold">I</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-cream tracking-tight mb-4 leading-tight">
          Welcome to
          <br />
          <span className="text-brand-orange">The Impact Team.</span>
        </h1>

        <p className="text-[#737373] text-lg mb-10 leading-relaxed">
          you just made a decision that most people never make.
          <br />
          let&apos;s make sure you get everything out of this.
        </p>

        <button
          onClick={() => goToPage(2)}
          className="btn-pulse cta-button text-white font-semibold text-lg px-10 py-4 rounded-xl"
        >
          let&apos;s go →
        </button>
      </div>
    </div>
  );

  // ─── PAGE 2: VSL + Testimonials ─────────────────────────────
  const VSLPage = () => (
    <div className="min-h-screen px-4 md:px-8 py-8">
      <div
        className={`max-w-3xl mx-auto transition-all duration-500 ${
          animateIn
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        <StepIndicator />

        {/* Video Section */}
        <div className="mb-8">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#161616] border border-[#262626] relative">
            {/* TODO: Replace this with your actual VSL video embed */}
            {/* Example: <iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" ... /> */}
            <iframe
  src="https://fast.wistia.net/embed/iframe/n0p5vzv7ir"
  className="w-full h-full"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  title="Impact Team VSL"
/>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-14">
          <button
            onClick={() => goToPage(3)}
            className="btn-pulse cta-button text-white font-semibold text-base md:text-lg px-8 py-4 rounded-xl"
          >
            i am committed to my success →
          </button>
        </div>

        {/* Testimonials Section */}
        <div className="border-t border-[#262626] pt-10">
          <h2 className="text-center text-[#737373] text-sm uppercase tracking-widest mb-2">
            Don&apos;t just take our word for it
          </h2>
          <p className="text-center text-brand-cream text-xl md:text-2xl font-bold mb-8">
            some results from people who were once on this exact page
            <br />
            <span className="text-brand-orange">
              and decided to treat sales like more than just a hobby.
            </span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="testimonial-card bg-[#161616] border border-[#262626] rounded-xl p-5"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {t.name}
                    </p>
                    <p className="text-brand-orange text-xs">{t.role}</p>
                  </div>
                </div>
                <p className="text-[#a3a3a3] text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ─── PAGE 3: Avatar / Bucket Selection ──────────────────────
  const AvatarPage = () => {
    const buckets = [
      {
        id: "new_to_workforce" as Bucket,
        emoji: "🌱",
        title: "I'm brand new",
        subtitle: "never had a job in sales or anything else",
        description:
          "you're starting from scratch — no resume, no experience, just ambition. that's more than enough. we'll show you exactly where to start and how to land your first role fast.",
      },
      {
        id: "career_switcher" as Bucket,
        emoji: "🔄",
        title: "I'm switching into sales",
        subtitle: "have work experience but new to sales",
        description:
          "you've been in the workforce but you know sales is where the real money is. we'll help you leverage your existing skills and make the transition seamlessly.",
      },
      {
        id: "already_in_sales" as Bucket,
        emoji: "🔥",
        title: "I'm already in sales",
        subtitle: "ready to go from good to unstoppable",
        description:
          "you're in the game but you want to dominate it. we'll give you the advanced strategies, accountability, and network to hit numbers you didn't think were possible.",
      },
    ];

    return (
      <div className="min-h-screen px-4 md:px-8 py-8">
        <div
          className={`max-w-2xl mx-auto transition-all duration-500 ${
            animateIn
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <StepIndicator />

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-cream mb-3">
              where are you right now?
            </h2>
            <p className="text-[#737373] text-base">
              pick the one that fits — we&apos;ll customize everything from here.
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-10">
            {buckets.map((b) => (
              <div
                key={b.id}
                onClick={() => handleBucketSelect(b.id)}
                className={`avatar-card bg-[#161616] border rounded-xl p-6 ${
                  selectedBucket === b.id
                    ? "selected border-brand-orange"
                    : "border-[#262626]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl mt-0.5">{b.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-bold text-lg">
                        {b.title}
                      </h3>
                      {selectedBucket === b.id && (
                        <div className="w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M2 6L5 9L10 3"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-brand-orange text-sm mb-2">
                      {b.subtitle}
                    </p>
                    <p className="text-[#737373] text-sm leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => goToPage(4)}
              disabled={!selectedBucket}
              className="btn-pulse cta-button text-white font-semibold text-lg px-10 py-4 rounded-xl disabled:opacity-30"
            >
              that&apos;s me — continue →
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── PAGE 4: Features Overview ──────────────────────────────
  const FeaturesPage = () => (
    <div className="min-h-screen px-4 md:px-8 py-8">
      <div
        className={`max-w-3xl mx-auto transition-all duration-500 ${
          animateIn
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        <StepIndicator />

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-cream mb-3">
            here&apos;s what you just unlocked.
          </h2>
          <p className="text-[#737373] text-base">
            tap any feature to see a quick preview of how it works.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {features.map((f, i) => (
            <div
              key={i}
              onClick={() => setVideoModal(f.videoUrl)}
              className="feature-card bg-[#161616] border border-[#262626] rounded-xl p-5 cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">{f.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-base mb-1">
                      {f.title}
                    </h3>
                    <svg
                      className="w-5 h-5 text-[#737373] group-hover:text-brand-orange transition-colors"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-[#737373] text-sm leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={startLoadingTransition}
            className="btn-pulse cta-button text-white font-semibold text-lg px-10 py-4 rounded-xl"
          >
            show me my personalized plan →
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {videoModal && (
        <div
          className="modal-backdrop fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setVideoModal(null)}
        >
          <div
            className="w-full max-w-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoModal(null)}
              className="btn-pulse absolute -top-10 right-0 text-white/60 hover:text-white text-sm"
            >
              ✕ close
            </button>
            <div className="aspect-video rounded-xl overflow-hidden bg-[#161616] border border-[#262626]">
              <iframe
                src={videoModal}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Feature Demo"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ─── LOADING SCREEN (between page 4 → 5) ───────────────────
  const LoadingScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        {/* Pulsing icon */}
        <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
          <svg
            className="w-8 h-8 text-brand-orange"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-brand-cream mb-2">
          generating your personalized plan
        </h2>
        <p className="text-brand-orange text-sm mb-8 h-5">
          {loadingText}
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-[#262626] overflow-hidden mb-4">
          <div
            className="h-full rounded-full loading-bar-fill transition-all duration-100 ease-linear animate-shimmer"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <p className="text-[#737373] text-xs">{Math.round(loadingProgress)}%</p>
      </div>
    </div>
  );

  // ─── PAGE 5: Personalized Next Steps ────────────────────────
  // ─── REPLACEMENT #2: Replace the entire NextStepsPage component with this ───

  const NextStepsPage = () => {
    const steps = nextStepsMap[selectedBucket || "new_to_workforce"];
    const bucketLabels: Record<string, string> = {
      new_to_workforce: "brand new to the game",
      career_switcher: "switching into sales",
      already_in_sales: "already in sales and ready to dominate",
    };

    return (
      <div className="min-h-screen px-4 md:px-8 py-8">
        <div
          className={`max-w-2xl mx-auto transition-all duration-500 ${
            animateIn
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <StepIndicator />

          <div className="text-center mb-12">
            <div className="inline-block bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              plan ready
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-cream mb-3">
              your next moves.
            </h2>
            <p className="text-[#737373] text-base">
              since you&apos;re{" "}
              <span className="text-brand-orange">
                {bucketLabels[selectedBucket || "new_to_workforce"]}
              </span>
              , here&apos;s exactly where to start.
            </p>
          </div>

          <div className="relative flex flex-col gap-6 mb-10">
            {/* gradient timeline line */}
            <div
              className="absolute left-6 top-6 bottom-6 w-[2px]"
              style={{
                background:
                  "linear-gradient(to bottom, #FA4616 0%, #FA461640 50%, #FA461610 100%)",
              }}
            />

            {steps.map((step, i) => (
              <div key={i} className="relative flex items-start gap-5">
                <div
                  className="relative z-10 w-12 h-12 rounded-xl bg-brand-orange flex items-center justify-center text-white font-extrabold text-base shrink-0"
                  style={{ boxShadow: "0 8px 24px rgba(250, 70, 22, 0.3)" }}
                >
                  {step.icon}
                </div>
                <div className="flex-1 bg-[#161616] border border-[#262626] rounded-xl p-6 hover:border-[#363636] transition-colors">
                  <h3 className="text-white font-extrabold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#737373] text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>
                  <button className="btn-pulse border border-[#363636] text-[#e5e5e5] text-sm font-medium px-5 py-2.5 rounded-lg bg-transparent hover:bg-[#1a1a1a] transition-colors">
                    {step.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 inline-block">
              <p className="text-brand-cream font-semibold mb-1">
                you&apos;re all set. go make an impact.
              </p>
              <p className="text-[#737373] text-sm">
                close this page and start working through your plan. we&apos;ll
                see you inside. 🔥
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Render ─────────────────────────────────────────────────
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {currentPage === 1 && <WelcomePage />}
      {currentPage === 2 && <VSLPage />}
      {currentPage === 3 && <AvatarPage />}
      {currentPage === 4 && <FeaturesPage />}
      {currentPage === 5 && <NextStepsPage />}
    </div>
  );
}
