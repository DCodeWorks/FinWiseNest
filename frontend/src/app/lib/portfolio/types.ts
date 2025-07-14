export interface Holding {
  ticker: string;
  name: string;
  marketValue: number;
  dayGain: number;
  dayGainPercent: number;
  totalGain: number;
  totalGainPercent: number;
}

export type Transaction = {
  id: number;
  transactionDate: string;
  ticker: string;
  type: number; // 0: Buy, 1: Sell, 2: Dividend
  quantity: number;
  pricePerShare: number;
  totalAmount: number;
};

// Mock data to simulate what an API would return
export const mockHoldings: Holding[] = [
  {
    ticker: "ROG.SW",
    name: "Roche Holding AG",
    marketValue: 95450.75,
    dayGain: 340.1,
    dayGainPercent: 0.36,
    totalGain: 8120.5,
    totalGainPercent: 9.29,
  },
  {
    ticker: "IWDA.AS",
    name: "iShares MSCI World ETF",
    marketValue: 62100.2,
    dayGain: -150.4,
    dayGainPercent: -0.24,
    totalGain: 4500.0,
    totalGainPercent: 7.81,
  },
  {
    ticker: "NESN.SW",
    name: "Nestlé S.A.",
    marketValue: 45300.0,
    dayGain: 112.0,
    dayGainPercent: 0.25,
    totalGain: 2330.9,
    totalGainPercent: 5.42,
  },
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    marketValue: 35870.5,
    dayGain: -55.8,
    dayGainPercent: -0.16,
    totalGain: 11840.1,
    totalGainPercent: 49.27,
  },
];
