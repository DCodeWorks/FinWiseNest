import { PortfolioView } from "@/components/PortfolioView";
import { Holding } from "../lib/portfolio/types";

type DataPoint = { date: string; value: number };

const API_BASE_URL_PORTFOLIO = process.env.NEXT_PUBLIC_API_BASE_URL_PORTFOLIO;
if (!API_BASE_URL_PORTFOLIO) {
  throw new Error(
    "API_BASE_URL_PORTFOLIO is not defined. Check your .env files."
  );
}
async function getPortfoliodata(): Promise<Holding[]> {
  try {
    const response = await fetch(`${API_BASE_URL_PORTFOLIO}/api/portfolio`, {
      cache: "no-store",
    });
    if (!response.ok) return [];

    const data: Holding[] = await response.json();

    return data;
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return [];
  }
}

async function getPerformanceHistory(): Promise<DataPoint[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL_PORTFOLIO}/api/portfolio/performance-history`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.history;
  } catch (error) {
    console.error("Failed to fetch performance history:", error);
    return [];
  }
}

export default async function PortfolioPage() {
  const holdings = await getPortfoliodata();
  const history = await getPerformanceHistory();
  const totalValue = holdings.reduce((acc, h) => acc + h.marketValue, 0);

  if (holdings.length === 0) return <h1>No data available</h1>;

  return (
    <PortfolioView
      holdings={holdings}
      portfolioValue={totalValue}
      performanceHistory={history}
    />
  );
}
