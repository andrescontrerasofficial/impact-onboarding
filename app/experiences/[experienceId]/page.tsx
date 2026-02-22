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
      // Use members endpoint which includes email
      const members = await whopApi.members.list({
  user_ids: [userId],
});
      
      const member = members.data?.[0];
      if (member) {
        userName = member.user?.name || member.user?.username || "";
        userEmail = member.user?.email || "";
      }
      
      console.log("=== MEMBER DATA ===", JSON.stringify(member));
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