import OnboardingFlow from "@/app/components/OnboardingFlow";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;

  return (
    <OnboardingFlow
      experienceId={experienceId}
      userId=""
      userName=""
      userEmail=""
    />
  );
}