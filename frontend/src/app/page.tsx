// src/app/page.tsx
import { Dashboard } from "@/components/Dashboard";

async function getDashboardData() {
  try {
    // Ensure this port matches your running PortfolioService
    const res = await fetch(
      "http://localhost:5000/api/portfolio/dashboard-summary",
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return null;
  }
}

export default async function HomePage() {
  const data = await getDashboardData();

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </header>
      <main>
        {data ? (
          <Dashboard data={data} />
        ) : (
          <p className="text-center text-gray-500">
            Could not load dashboard data. Please ensure the backend service is
            running.
          </p>
        )}
        {/* We can add other components like Recent Transactions here later */}
      </main>
    </div>
  );
}
