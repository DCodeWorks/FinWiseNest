import { PortfolioView } from "@/components/PortfolioView";
import { Holding } from "../lib/portfolio/types";

type DataPoint = { date: string; value: number };

async function getPortfoliodata(): Promise<Holding[]> {
  try {
    const response = await fetch("http://localhost:5000/api/portfolio", {
      cache: "no-store",
    });
    if (!response.ok) return [];

    const data: Holding[] = await response.json();

    return data;
  } catch (error) {
    console.error('An error occurred while fetching data:', error);
    return [];
  }
}

async function getPerformanceHistory(): Promise<DataPoint[]> {
    try {
        const res = await fetch('http://localhost:5000/api/portfolio/performance-history', { cache: 'no-store' });
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

  return <PortfolioView holdings={holdings} portfolioValue={totalValue} performanceHistory={history} />;
}
