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
      // Try members endpoint first (includes email)
      try {
        const members = await whopApi.members.list({
  user_ids: [userId],
  company_id: "biz_Q5DDkoMFnWe7fu",
});
        const member = members.data?.[0];
        if (member) {
          userName = member.user?.name || member.user?.username || "";
          userEmail = member.user?.email || "";
        }
        console.log("=== MEMBER RESULT ===", JSON.stringify(member));
      } catch (memberErr) {
        console.error("=== MEMBER ERROR ===", memberErr);
        
        // Fallback to users endpoint (no email but gets name)
        try {
          const user = await whopApi.users.retrieve(userId);
          userName = user.name || user.username || "";
          console.log("=== USER RESULT ===", JSON.stringify(user));
        } catch (userErr) {
          console.error("=== USER ERROR ===", userErr);
        }
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