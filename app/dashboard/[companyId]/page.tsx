export default async function DashboardPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">
          Impact Team Onboarding — Dashboard
        </h1>
        <p className="text-[#737373] mb-6">Company: {companyId}</p>
        <div className="bg-[#161616] border border-[#262626] rounded-xl p-6">
          <p className="text-[#e5e5e5]">
            Your onboarding flow is active. Members will see it when they access
            this app from your Whop community. Lead data is being sent to
            GoHighLevel automatically when members select their avatar.
          </p>
        </div>
      </div>
    </div>
  );
}
