import { headers } from "next/headers";
import { whopApi } from "@/app/lib/whop-api";
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
      const user = await whopApi.users.retrieve(userId);
      userName = user.name || user.username || "";
      console.log("=== USER DATA ===", JSON.stringify(user));
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