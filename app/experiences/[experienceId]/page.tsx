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
    
    // Log ALL headers so we can see what Whop actually sends
    const allHeaders: Record<string, string> = {};
    headersList.forEach((value, key) => {
      allHeaders[key] = value;
    });
    console.log("=== ALL HEADERS ===", JSON.stringify(allHeaders, null, 2));

    // Try multiple possible header names
    userId = headersList.get("x-whop-user-id") 
      || headersList.get("x-whop-user") 
      || headersList.get("x-whop-user-token")
      || "";
    
    console.log("=== RESOLVED USER ID ===", userId);

    if (userId) {
      const apiUrl = `https://api.whop.com/api/v5/users/${userId}`;
      console.log("=== FETCHING ===", apiUrl);
      
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
        },
      });
      
      console.log("=== API RESPONSE STATUS ===", res.status);
      const user = await res.json();
      console.log("=== API RESPONSE BODY ===", JSON.stringify(user));
      
      if (res.ok) {
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