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
    const userToken = headersList.get("x-whop-user-token") || "";

    if (userToken) {
      const payload = JSON.parse(
        Buffer.from(userToken.split(".")[1], "base64").toString()
      );
      userId = payload.sub || "";
    }

    if (userId) {
      // Try multiple API approaches
      let user = null;

      // Approach 1: v5 API with API key
      const res1 = await fetch(`https://api.whop.com/api/v5/users/${userId}`, {
        headers: { Authorization: `Bearer ${process.env.WHOP_API_KEY}` },
      });
      console.log("v5 API status:", res1.status);
      if (res1.ok) {
        user = await res1.json();
        console.log("v5 user data:", JSON.stringify(user));
      } else {
        console.log("v5 error:", await res1.text());
      }

      // Approach 2: v2 API if v5 failed
      if (!user) {
        const res2 = await fetch(`https://api.whop.com/api/v2/me`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        console.log("v2 me status:", res2.status);
        if (res2.ok) {
          user = await res2.json();
          console.log("v2 user data:", JSON.stringify(user));
        } else {
          console.log("v2 error:", await res2.text());
        }
      }

      if (user) {
        userName = user.name || user.username || user.display_name || "";
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