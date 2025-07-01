import { PortfolioView } from "@/components/PortfolioView";
import { mockHoldings } from "../lib/portfolio/types";

export default function PortfolioPage() {
  const holdings = mockHoldings;
  const totalValue = holdings.reduce((acc, h) => acc + h.marketValue, 0);

  return <PortfolioView holdings={holdings} portfolioValue={totalValue} />;
}
