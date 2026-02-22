import { headers } from "next/headers";
import OnboardingFlow from "@/app/components/OnboardingFlow";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;

  let userId = "";
  let userName = "";
  let userEmail = "";

  try {
    const headersList = await headers();
    userId = headersList.get("x-whop-user-id") || "";

    if (userId) {
      const res = await fetch(`https://api.whop.com/api/v5/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
        },
      });
      if (res.ok) {
        const user = await res.json();
        userName = user.name || user.username || "";
        userEmail = user.email || "";
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  return (
    <OnboardingFlow
      experienceId={experienceId}
      userId={userId}
      userName={userName}
      userEmail={userEmail}
    />
  );
}