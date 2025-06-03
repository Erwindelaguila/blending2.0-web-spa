

import { WelcomeDashboard } from "@/components/dashboard/welcome-dashboard"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <main className="flex-1 flex items-center justify-center py-12">
        <WelcomeDashboard />
      </main>
    </div>
  )
}
