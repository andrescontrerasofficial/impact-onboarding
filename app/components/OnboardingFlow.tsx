"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createSdk } from "@whop/iframe";
import confetti from "canvas-confetti";

// ─── Types ──────────────────────────────────────────────────────────
type Bucket = "new_to_workforce" | "career_switcher" | "already_in_sales" | null;

interface OnboardingFlowProps {
  experienceId: string;
  userId: string;
  userName: string;
  userEmail: string;
}

// ─── Testimonial Data ───────────────────────────────────────────────
// Each bucket gets exactly 3 testimonials shown on the VSL page.
// Replace the placeholder entries below with your real ones.
// Fields: name (display name), role (result / outcome line), quote (their words), avatar (2-letter initials)

const testimonialsByBucket = {

  // ── Shown when avatar = "The Explorer" (no work experience) ──────────
  new_to_workforce: [
    {
      name: "Brayden Decker",
      role: "$25k in Student Loan Debt to $15k/mo Earner",
      quote:
        "Was in a frat and heard of Impact and andres from a friend and decided to give it a shot even though I was already 25k in student loan debt but thank God i hit 15k/month consistent in 4ish months.",
      avatar: "BD",
      image: "/brayden.png",
    },
    {
      name: "Mila Sokolskiy",
      role: "$1k commission days at 17",
      quote: "First 1k comm day on new years eve and im on track to make Jan my highest month. Thanks to impact🐐",
      avatar: "MS",
      image: "/mila.jpg",
    },
    {
      name: "Phillip Ek",
      role: "Removed from our house to $20k/month",
      quote: "I worked with Andres since he ran an agency years ago. My mom and I got kicked out of our house and struggled around europe for a while. I saw the entire journey of Impact and rose with it. Made 20k last month in commissions selling for AI Acquisitions (they also got me on the offer).",
      avatar: "PE",
      image: "/phillip.png",
    },
  ],

  // ── Shown when avatar = "The Builder" (career switcher) ──────────────
  career_switcher: [
    {
      name: "Hunter Claassen",
      role: "From LA fitness to $108k Commission Month",
      quote:
        "I was working at LA fitness super underpaid. Did training with Andres and hit 108k highest month in commissions 5 months later. The breakdown was $416k cash collected that month, 22% commission, 20k in bonus.",
      avatar: "HC",
      image: "/hunter.png",
    },
    {
      name: "Brayden Decker",
      role: "$25k in Student Loan Debt to $15k/mo Earner",
      quote: "Was in a frat and heard of Impact and andres from a friend and decided to give it a shot even though I was already 25k in student loan debt but thank God i hit 15k/month consistent in 4ish months.",
      avatar: "BD",
      image: "/brayden.png",
    },
    {
      name: "James Wu",
      role: "Marketing agency to $50k/mo AUD commission rep",
      quote: "First 50k AUD month last month. Came to Impact Team with no sales experience, I was running an SMMA before but never made more than a couple grand.",
      avatar: "JW",
      image: "/james.png",
    },
  ],

  // ── Shown when avatar = "The Scientist" (already in sales) ───────────
  already_in_sales: [
    {
      name: "Hunter Claassen",
      role: "From LA fitness sales to $108k Commission Month",
      quote:
        "I was selling for LA fitness at the front desk super underpaid. Did training with Andres and hit 108k highest month in commissions 5 months later. The breakdown was $416k cash collected that month, 22% commission, 20k in bonus.",
      avatar: "HC",
      image: "/hunter.png",
    },
    {
      name: "Abel DaSilva",
      role: "$15k to $30k/mo in comms selling a trading algorithm",
      quote: "Impact gave me overall a clear structure knowing exactly what answers I needed from every questions and the objection handling sequence. Before HIGHEST month EVER was 15k this month theres 5 days left and im pacing 300k cash and 30k comms.",
      avatar: "AD",
      image: "/abel.png",
    },
    {
      name: "Omid Aboui",
      role: "$500 in bank to $40k/mo selling a SAAS",
      quote: "I paid $16k for 7th level IC and it helped a bit with concepts and got me to 3-4k/month. I stayed on the same offer selling a marketing SAAS but in 3 months with Impact hit my first 40k month in income because I was actually able to implement the process.",
      avatar: "OA",
      image: "/omid.png",
    },
  ],
};

// ─── Feature Data ───────────────────────────────────────────────────
const features = [
  {
    title: "The Library",
    subtitle: "Scripting Course Modules",
    description: "Learn the Impact script across a 4 week training program.",
    image: "/whop-illo-books.svg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "The Quiz",
    subtitle: "Weekly Comprehension Checks",
    description: "Assesments after every weeks' content to retain the information.",
    image: "/whop-illo-graduation.svg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "The Game Tape",
    subtitle: "Sales Call Recording Clips",
    description: "See the Impact script implemented on real sales calls.",
    image: "/whop-illo-phone.svg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "The Live Stage",
    subtitle: "Weekly Coaching Sessions",
    description: "Implement Impact to your industry & QNA.",
    image: "/whop-illo-messaging.svg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "The Shop",
    subtitle: "Point System",
    description: "Earn points, spend on real rewards, compete on leaderboards.",
    image: "/whop-illo-trophy.svg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "The Community",
    subtitle: "Roleplay & Grow With People",
    description: "Don't try to roleplay and practice in a mirror. Please.",
    image: "/whop-illo-livestream.svg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

// ─── Next Steps Data ─────────────────────────────────────────────────
// 3 steps, same for every avatar — only the description copy changes.

const nextStepsMap: Record<
  string,
  { title: string; description: string; cta: string; icon: string; url: string }[]
> = {
  new_to_workforce: [
    {
      title: "Join the Community",
      description:
        "This is where it starts. The community is full of people in your exact spot — no experience, betting on themselves anyway. Introduce yourself, ask questions, and never feel like you're figuring this out alone.",
      cta: "Join Discord →",
      icon: "01",
      url: "https://whop.com/joined/impact-team-vip/discord-ZgU3abUthNyYD4/app/",
    },
    {
      title: "Watch the First Module",
      description:
        "You don't know what you don't know yet — and that's okay. This module breaks down how high-ticket sales actually works and exactly what separates reps who make $5k/mo from ones making $30k.",
      cta: "Start Watching →",
      icon: "02",
      url: "https://whop.com/joined/impact-team-vip/impact-sales-course-wcqbjJXuoKEPWo/app/courses/cors_1NtY86gsAfkVYQNyAXEkXR/lessons/lesn_sk8SpvBD3szEw/",
    },
    {
      title: "Try VIP Free for 3 Days",
      description:
        "8 coaching calls per week. Full sales call recordings. A private portal built to get you to your first $10k month faster. There's no better use of 3 free days than going all in on this.",
      cta: "Start Free Trial →",
      icon: "03",
      url: "https://whop.com/checkout/plan_K5ZFOQY5O7ZuP/",
    },
  ],
  career_switcher: [
    {
      title: "Join the Community",
      description:
        "This is where people who made the same leap you're about to make hang out every day. Introduce yourself, say where you're coming from, and watch how fast this community shows up for you.",
      cta: "Join Discord →",
      icon: "01",
      url: "https://whop.com/joined/impact-team-vip/discord-ZgU3abUthNyYD4/app/",
    },
    {
      title: "Watch the First Module",
      description:
        "Your background gives you an edge most people don't have. This module shows you how to apply what you already know inside the Impact framework — and where to rewire the habits that won't serve you in high-ticket sales.",
      cta: "Start Watching →",
      icon: "02",
      url: "https://whop.com/joined/impact-team-vip/impact-sales-course-wcqbjJXuoKEPWo/app/courses/cors_1NtY86gsAfkVYQNyAXEkXR/lessons/lesn_sk8SpvBD3szEw/",
    },
    {
      title: "Try VIP Free for 3 Days",
      description:
        "The fastest path from your current career to a $20k+ month in sales is cutting the learning curve in half. VIP gives you 8 live coaching calls a week, full call recordings from real closers, and direct access to people who've already made this transition. 3 days free.",
      cta: "Start Free Trial →",
      icon: "03",
      url: "https://whop.com/checkout/plan_K5ZFOQY5O7ZuP/",
    },
  ],
  already_in_sales: [
    {
      title: "Join the Community",
      description:
        "Your environment is your ceiling. Get inside the community and surround yourself with reps who are building serious numbers. The energy in here is different — and it's contagious.",
      cta: "Join Discord →",
      icon: "01",
      url: "https://whop.com/joined/impact-team-vip/discord-ZgU3abUthNyYD4/app/",
    },
    {
      title: "Watch the First Module",
      description:
        "You've sold before. This shows you how the top 1% do it differently. Even if 20% of it is new to you, that 20% is the thing that takes you from good to elite. Don't skip it.",
      cta: "Start Watching →",
      icon: "02",
      url: "https://whop.com/joined/impact-team-vip/impact-sales-course-wcqbjJXuoKEPWo/app/courses/cors_1NtY86gsAfkVYQNyAXEkXR/lessons/lesn_sk8SpvBD3szEw/",
    },
    {
      title: "Try VIP Free for 3 Days",
      description:
        "You already know the difference between being coached once a week and being coached 8 times. VIP gives you 8 calls/week, full call recordings, and direct access to closers doing the numbers you want to hit. Try it free. You'll know by day one.",
      cta: "Start Free Trial →",
      icon: "03",
      url: "https://whop.com/checkout/plan_K5ZFOQY5O7ZuP/",
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
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const sdkRef = useRef<ReturnType<typeof createSdk> | null>(null);

  const navigate = useCallback((url: string) => {
    // Detect Whop mobile app (React Native WebView or WKWebView)
    const isMobile =
      "ReactNativeWebView" in window ||
      !!(window as { webkit?: { messageHandlers?: unknown } }).webkit?.messageHandlers;
    if (sdkRef.current) {
      sdkRef.current.openExternalUrl({ url, newTab: !isMobile });
    } else {
      window.open(url, "_blank");
    }
  }, []);

  // ─── Persist & restore progress ─────────────────────────────
  useEffect(() => {
    const page = localStorage.getItem("impact_page");
    const bucket = localStorage.getItem("impact_bucket");
    const steps = localStorage.getItem("impact_steps");
    if (page) setCurrentPage(parseInt(page));
    if (bucket) setSelectedBucket(bucket as Bucket);
    if (steps) setCompletedSteps(new Set(JSON.parse(steps) as number[]));
  }, []);

  useEffect(() => {
    localStorage.setItem("impact_page", String(currentPage));
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("impact_bucket", selectedBucket ?? "");
  }, [selectedBucket]);

  useEffect(() => {
    localStorage.setItem("impact_steps", JSON.stringify([...completedSteps]));
  }, [completedSteps]);

  // ─── Whop theme sync ────────────────────────────────────────
  useEffect(() => {
    const applyTheme = (appearance: "light" | "dark") => {
      document.documentElement.setAttribute("data-theme", appearance);
    };

    const init = async () => {
      try {
        const sdk = createSdk({
          onMessage: {
            onColorThemeChange: (colorTheme) => {
              applyTheme(colorTheme.appearance ?? "dark");
            },
          },
        });
        sdkRef.current = sdk;
        const colorTheme = await sdk.getColorTheme();
        applyTheme(colorTheme.appearance ?? "dark");
      } catch {
        // Not inside a Whop iframe (e.g. dev) — default to dark
        applyTheme("dark");
      }
    };

    init();
  }, []);
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

  // ─── Back Button ────────────────────────────────────────────
  const BackButton = ({ to }: { to: number }) => (
    <div className="text-center pt-8 pb-2">
      <button
        onClick={() => goToPage(to)}
        className="text-[var(--c-muted)] text-sm hover:text-[var(--c-text)] transition-colors"
      >
        ← back
      </button>
    </div>
  );

  // Animation helper — e.g. style={anim("fadeSlideUp", 0.2)}
  const anim = (name: string, delay: number, duration = 0.48) => ({
    animation: `${name} ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
  });

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
              : "bg-[var(--c-border)]"
          }`}
        />
      ))}
    </div>
  );

  // ─── PAGE 1: Welcome ────────────────────────────────────────
  const WelcomePage = () => {
    const firstName = userName || null;
    return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div
        className={`max-w-lg transition-all duration-500 ${
          animateIn
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        {/* Company logo — swaps between dark / light theme */}
        <div style={anim("fadeSlideDown", 0)} className="mx-auto mb-8 flex items-center justify-center">
          <div
            className="relative inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-brand-orange/15 to-brand-orange/5 border border-brand-orange/20"
            style={{ boxShadow: "0 0 40px rgba(250, 70, 22, 0.12), 0 0 0 1px rgba(250, 70, 22, 0.06)" }}
          >
            <img src="/original-logo.svg" alt="The Impact Team" className="logo-img h-10 w-10 object-contain" />
          </div>
        </div>

        {firstName && (
          <p style={anim("fadeSlideUp", 0.1)} className="text-[var(--c-muted)] text-xl mb-3">Hey, {firstName}.</p>
        )}

        <h1 style={anim("fadeSlideUp", 0.18)} className="text-5xl md:text-6xl font-extrabold text-[var(--c-heading)] tracking-tight mb-4 leading-tight">
          Welcome to
          <br />
          <span className="text-brand-orange">The Impact Team.</span>
        </h1>

        <p style={anim("fadeSlideUp", 0.3)} className="text-[var(--c-muted)] text-lg mb-10 leading-relaxed">
          Learn how to close high-ticket deals with a simple formula.
        </p>

        <button
          style={anim("fadeSlideUp", 0.42)}
          onClick={() => goToPage(2)}
          className="btn-pulse cta-button text-white font-semibold text-lg px-10 py-4 rounded-xl"
        >
          Let&apos;s go. Takes 3 min. →
        </button>
      </div>
    </div>
  );
  };

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

        <div style={anim("fadeSlideUp", 0.05)} className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--c-heading)] mb-3">
            This is not a <span className="text-brand-orange">hobby.</span>
          </h2>
          <p className="text-[var(--c-muted)] text-base">
            At <span className="text-brand-orange">Impact</span>, we follow the <span className="text-brand-orange">Michelin Standard.</span> To stay in this room, you have to <span className="text-brand-orange">execute.</span>
          </p>
        </div>

        {/* Video Section */}
        <div style={anim("scaleIn", 0.18, 0.55)} className="mb-8">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-[var(--c-card)] border border-[var(--c-border)] relative">
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
        <div style={anim("fadeSlideUp", 0.32)} className="text-center mb-14">
          <button
            onClick={() => goToPage(4)}
            className="btn-pulse cta-button text-white font-semibold text-base md:text-lg px-8 py-4 rounded-xl"
          >
            I am committed to my success →
          </button>
        </div>

        {/* Testimonials Section */}
        <div style={anim("fadeSlideUp", 0.45)} className="border-t border-[var(--c-border)] pt-10">
          {(() => {
            const bucketPhrases: Record<string, string> = {
              new_to_workforce: "had no work experience, got into sales",
              career_switcher: "transitioned careers into sales",
              already_in_sales: "were in sales but wanted to grow",
            };
            const phrase = selectedBucket ? bucketPhrases[selectedBucket] : null;
            return (
              <h2 className="text-center text-xl md:text-2xl font-bold text-[var(--c-heading)] mb-8">
                {phrase ? (
                  <>
                    Other people who{" "}
                    <span className="text-brand-orange">{phrase}</span>, were on
                    this page, and committed to succeeding.
                  </>
                ) : (
                  <>
                    The kind of <span className="text-brand-orange">results</span>{" "}
                    you get when you treat this like more than a hobby.
                  </>
                )}
              </h2>
            );
          })()}

          <div className="grid grid-cols-1 gap-4">
            {(testimonialsByBucket[selectedBucket ?? "new_to_workforce"] ?? testimonialsByBucket.new_to_workforce).map((t, i) => (
              <div
                key={i}
                className="testimonial-card bg-[var(--c-card)] border border-[var(--c-border)] rounded-xl p-5"
                style={anim("fadeSlideUp", 0.55 + i * 0.08)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-brand-orange/20 flex-shrink-0">
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-brand-orange/10 flex items-center justify-center text-brand-orange text-sm font-bold">
                        {t.avatar}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[var(--c-text)] font-semibold text-lg">
                      {t.name}
                    </p>
                    <p className="text-brand-orange text-sm">{t.role}</p>
                  </div>
                </div>
                <p className="text-[var(--c-muted)] text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button (repeated below testimonials) */}
          <div className="text-center mt-8">
            <button
              onClick={() => goToPage(4)}
              className="btn-pulse cta-button text-white font-semibold text-base md:text-lg px-8 py-4 rounded-xl"
            >
              I am committed to my success →
            </button>
          </div>

          <BackButton to={2} />
        </div>
      </div>
    </div>
  );

  // ─── PAGE 3: Avatar / Bucket Selection ──────────────────────
  const renderAvatarPage = () => {
    const buckets = [
      {
        id: "new_to_workforce" as Bucket,
        image: "/avatar-explorer.svg",
        title: "The Explorer",
        subtitle: "No Work Experience",
        description: "I've never worked any job full time. I will crush this 1st one.",
      },
      {
        id: "career_switcher" as Bucket,
        image: "/avatar-scientist.svg",
        title: "The Scientist",
        subtitle: "Coming From Another Field",
        description: "I have a job. Now I want to go where the $ is - sales.",
      },
      {
        id: "already_in_sales" as Bucket,
        image: "/avatar-builder.svg",
        title: "The Builder",
        subtitle: "Already In Sales",
        description: "I'm in sales, but I want to learn to be fucking #1.",
      },
    ];

    return (
      <div className="min-h-screen px-4 md:px-8 py-8">
        <div
          className={`max-w-4xl mx-auto transition-all duration-500 ${
            animateIn
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <StepIndicator />

          <div style={anim("fadeSlideUp", 0.05)} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--c-heading)] mb-3">
              Tailor your <span className="text-brand-orange">experience.</span>
            </h2>
            <p className="text-[var(--c-muted)] text-base">
              Before we open the <span className="text-brand-orange">gates</span>, tell us who you are so we can tailor the <span className="text-brand-orange">blueprint</span>.
            </p>
          </div>

          {/* Card grid with sweeping ambient glow behind it */}
          <div className="relative mb-10">
            {/* Sweeping orange ambient glow */}
            <div
              className="absolute pointer-events-none sweep-glow"
              style={{
                inset: "-80px",
                background: "radial-gradient(ellipse 60% 75% at 50% 55%, rgba(250, 70, 22, 0.28) 0%, transparent 65%)",
              }}
            />

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            {buckets.map((b, idx) => (
              <div
                key={b.id}
                onClick={() => handleBucketSelect(b.id)}
                className={`avatar-card relative border-2 rounded-3xl p-5 md:p-8 text-center flex flex-col items-center overflow-hidden transition-all duration-300 ${
                  selectedBucket === b.id
                    ? "is-selected border-brand-orange"
                    : "border-[var(--c-border)]"
                }`}
                style={{
                  ...anim("fadeSlideUp", 0.15 + idx * 0.12),
                  background: selectedBucket === b.id
                    ? "var(--c-avatar-selected-bg)"
                    : "var(--c-bg)",
                  boxShadow: selectedBucket === b.id
                    ? "0 0 0 1px rgba(250, 70, 22, 0.35), 0 0 30px rgba(250, 70, 22, 0.28), 0 0 65px rgba(250, 70, 22, 0.12)"
                    : "none",
                }}
              >
                {/* Image */}
                <div className="relative mb-4 md:mb-6 mt-1 md:mt-2">
                  <img src={b.image} alt={b.title} className="avatar-img relative w-20 h-20 md:w-28 md:h-28 object-contain" />
                </div>

                {/* Title */}
                <h3 className="text-[var(--c-text)] font-extrabold text-xl md:text-[1.65rem] mb-2.5">
                  {b.title}
                </h3>

                {/* Subtitle */}
                <p className="text-brand-orange text-[13px] md:text-[15px] font-semibold mb-3 md:mb-4">
                  {b.subtitle}
                </p>

                {/* Description */}
                <p className="text-[var(--c-muted)] text-xs md:text-sm leading-relaxed flex-1">
                  {b.description}
                </p>

                {/* Selected checkmark */}
                {selectedBucket === b.id && (
                  <div className="mt-3 md:mt-5 w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center" style={{ boxShadow: "0 0 16px rgba(250, 70, 22, 0.5)" }}>
                    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
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
            ))}
          </div>
          </div>{/* end relative mb-10 wrapper */}

          <div className="text-center">
            <button
              onClick={() => goToPage(3)}
              disabled={!selectedBucket}
              className="btn-pulse cta-button text-white font-semibold text-lg px-10 py-4 rounded-xl disabled:opacity-30"
            >
              That&apos;s me - continue →
            </button>
          </div>
          <BackButton to={1} />
        </div>
      </div>
    );
  };

  // ─── PAGE 4: Features Overview ──────────────────────────────
  const renderFeaturesPage = () => (
    <div className="min-h-screen px-4 md:px-8 py-8">
      <div
        className={`max-w-3xl mx-auto transition-all duration-500 ${
          animateIn
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        <StepIndicator />

        <div style={anim("fadeSlideUp", 0.05)} className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--c-heading)] mb-3">
            Don&apos;t get <span className="text-brand-orange">lost</span> in the <span className="text-brand-orange">sauce.</span>
          </h2>
          <p className="text-[var(--c-muted)] text-base">
            You <span className="text-brand-orange">live</span> here now. Click a feature to get a <span className="text-brand-orange">preview.</span>
          </p>
        </div>

        <div className="relative mb-10">
          <div
            className="absolute pointer-events-none sweep-glow"
            style={{
              inset: "-80px",
              background: "radial-gradient(ellipse 60% 75% at 50% 55%, rgba(250, 70, 22, 0.28) 0%, transparent 65%)",
            }}
          />
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              onClick={() => setVideoModal(f.videoUrl)}
              className="feature-card bg-[var(--c-bg)] border border-[var(--c-border)] rounded-xl p-5 cursor-pointer group"
              style={anim("fadeSlideUp", 0.14 + i * 0.1)}
            >
              <div className="flex items-start gap-5">
                <img src={f.image} alt={f.title} className="w-14 h-14 object-contain flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[var(--c-text)] font-bold text-lg mb-0.5">
                        {f.title}
                      </h3>
                      <p className="text-brand-orange text-sm font-semibold mb-2">
                        {f.subtitle}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-[var(--c-muted)] group-hover:text-brand-orange transition-colors flex-shrink-0 mt-1"
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
                  <p className="text-[var(--c-muted)] text-sm leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>

        <div style={anim("fadeSlideUp", 0.78)} className="text-center">
          <button
            onClick={startLoadingTransition}
            className="btn-pulse cta-button text-white font-semibold text-lg px-10 py-4 rounded-xl"
          >
            Show me my tailored blueprint →
          </button>
        </div>
        <BackButton to={3} />
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
            <div className="aspect-video rounded-xl overflow-hidden bg-[var(--c-card)] border border-[var(--c-border)]">
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
  const renderLoadingScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        {/* Pulsing icon */}
        <div style={anim("scaleIn", 0, 0.5)} className="flex items-center justify-center mx-auto mb-8 animate-pulse">
          <img src="/Whop-Illo-Construction.svg" alt="Building your plan" className="w-24 h-24 object-contain" />
        </div>

        <h2 style={anim("fadeSlideUp", 0.15)} className="text-2xl font-bold text-[var(--c-heading)] mb-2">
          Generating your tailored blueprint
        </h2>
        <p style={anim("fadeSlideUp", 0.25)} className="text-brand-orange text-sm mb-8 h-5">
          {loadingText}
        </p>

        {/* Progress bar */}
        <div style={anim("fadeSlideUp", 0.35)} className="w-full h-2 rounded-full bg-[var(--c-border)] overflow-hidden mb-4">
          <div
            className="h-full rounded-full loading-bar-fill transition-all duration-100 ease-linear animate-shimmer"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <p className="text-[var(--c-muted)] text-xs">{Math.round(loadingProgress)}%</p>
      </div>
    </div>
  );

  // ─── PAGE 5: Personalized Next Steps ────────────────────────

  const NextStepsPage = () => {
    const steps = nextStepsMap[selectedBucket || "new_to_workforce"];
    const bucketLabels: Record<string, string> = {
      new_to_workforce: "brand new to the game",
      career_switcher: "switching into sales",
      already_in_sales: "already in sales looking to dominate",
    };

    const fireConfetti = () => {
      const colors = ["#fa4616", "#ff6b3d", "#fcf6f5", "#ffffff", "#141212"];
      // Centre burst
      confetti({ particleCount: 120, spread: 80, origin: { x: 0.5, y: 0.6 }, colors, startVelocity: 45 });
      // Left burst
      setTimeout(() => confetti({ particleCount: 70, spread: 55, angle: 60, origin: { x: 0.15, y: 0.65 }, colors }), 180);
      // Right burst
      setTimeout(() => confetti({ particleCount: 70, spread: 55, angle: 120, origin: { x: 0.85, y: 0.65 }, colors }), 360);
    };

    const handleStepClick = (i: number, url: string) => {
      navigate(url);
      const newCompleted = new Set([...completedSteps, i]);
      setCompletedSteps(newCompleted);
      if (newCompleted.size >= steps.length) fireConfetti();
    };

    return (
      <div className="min-h-screen px-4 md:px-8 py-8">

        <div
          className={`max-w-2xl mx-auto transition-all duration-500 ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <StepIndicator />

          <div style={anim("fadeSlideDown", 0.05)} className="text-center mb-12">
            <div className="inline-block bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              plan ready
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--c-heading)] mb-3">
              Your next 3 <span className="text-brand-orange">missions</span>.
            </h2>
            <p className="text-[var(--c-muted)] text-base">
              Since you&apos;re{" "}
              <span className="text-brand-orange">
                {bucketLabels[selectedBucket || "new_to_workforce"]}
              </span>
              , do these steps. Complete them all for a{" "}
              <span className="text-brand-orange">reward</span>.
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

            {steps.map((step, i) => {
              const isCompleted = completedSteps.has(i);
              const isActive = i === completedSteps.size;

              return (
                <div key={i} style={anim("fadeSlideUp", 0.2 + i * 0.14)} className="relative flex items-start gap-5">
                  {/* Step number / checkmark */}
                  <div
                    className="relative z-10 w-12 h-12 rounded-xl bg-brand-orange flex items-center justify-center text-white font-extrabold text-base shrink-0"
                    style={{ boxShadow: "0 8px 24px rgba(250,70,22,0.3)" }}
                  >
                    {isCompleted ? "✓" : step.icon}
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 bg-[var(--c-card)] border rounded-xl p-6 transition-colors duration-300 ${
                      isCompleted
                        ? "border-emerald-500/30"
                        : "border-[var(--c-border)] hover:border-[var(--c-border-strong)]"
                    }`}
                  >
                    <h3 className="text-[var(--c-text)] font-extrabold text-lg mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[var(--c-muted)] text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                        ✓ Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleStepClick(i, step.url)}
                        className={
                          isActive
                            ? "btn-pulse cta-button text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
                            : "border border-[var(--c-border-strong)] text-[var(--c-muted)] text-sm font-medium px-5 py-2.5 rounded-lg bg-transparent"
                        }
                      >
                        {step.cta}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <BackButton to={4} />

        </div>
      </div>
    );
  };

  // ─── Render ─────────────────────────────────────────────────
  if (isLoading) return renderLoadingScreen();

  return (
    <div className="min-h-screen bg-[var(--c-bg)]">
      {currentPage === 1 && <WelcomePage />}
      {currentPage === 2 && renderAvatarPage()}
      {currentPage === 3 && <VSLPage />}
      {currentPage === 4 && renderFeaturesPage()}
      {currentPage === 5 && <NextStepsPage />}
    </div>
  );
}
