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

    // Decode the JWT to get the user ID from the "sub" claim
    if (userToken) {
      const payload = JSON.parse(
        Buffer.from(userToken.split(".")[1], "base64").toString()
      );
      userId = payload.sub || "";
    }

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
      } else {
        console.error("Whop API error:", res.status, await res.text());
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