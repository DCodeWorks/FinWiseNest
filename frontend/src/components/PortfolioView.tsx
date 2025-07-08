"use client";

import React from "react";
import { Holding } from "@/app/lib/portfolio/types";
import { AddTransactionModal } from "./AddTransactionModal";
import usePortfolioUpdates from "@/hooks/usePortfolioUpdates";
interface PortfolioViewProp {
  holdings: Holding[];
  portfolioValue: number;
}

type TimeRangeButtonProps = {
  children: React.ReactNode;
  isActive?: boolean;
};

const TimeRangeButton = ({ children, isActive }: TimeRangeButtonProps) => {
  return (
    <button
      className={`px-3 py-1 text-sm font-medium rounded-md ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {children}
    </button>
  );
};

const formatCurrency = (value: number) =>
  `CHF ${value.toLocaleString("de-CH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatGain = (value: number, percent: number) => {
  const sign = value >= 0 ? "+" : "";
  const color = value >= 0 ? "" : "";
  return (
    <span>{`${sign}${formatCurrency(value)} (${sign}${percent.toFixed(
      2
    )}%)`}</span>
  );
};

export const PortfolioView = ({
  holdings,
  portfolioValue,
}: PortfolioViewProp) => {
  usePortfolioUpdates();
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <header className=" mb-8">
        <h1 className=" text-3xl font-bold text-gray-800">Portfolio</h1>
      </header>

      <div className=" bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <div>
            <p className=" text-sm text-gray-500">Portfolio Performance</p>
            <p className=" text-2xl font-bold text-gray-800">
              {formatCurrency(portfolioValue)}
            </p>
          </div>
          <div className="flex space-x-2">
            <TimeRangeButton>1D</TimeRangeButton>
            <TimeRangeButton>1W</TimeRangeButton>
            <TimeRangeButton isActive>1M</TimeRangeButton>
            <TimeRangeButton>YTD</TimeRangeButton>
            <TimeRangeButton>1Y</TimeRangeButton>
          </div>
        </div>
        <div className=" h-64 bg-gray-100 rounded-md flex items-center justify-center">
          <p className=" text-gray-400">--Chart will be integrated here--</p>
        </div>
      </div>

      <div className=" bg-white p-6 rounded-lg shadow-sm">
        <div className=" flex justify-between items-center mb-4">
          <h2 className=" text-xl font-bold text-gray-800">
            Investment Holdings
          </h2>
          <AddTransactionModal />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className=" border-b-2 border-gray-200">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-500">
                  Asset
                </th>
                <th className="p-3 text-sm font-semibold text-gray-500 text-right">
                  Market Value
                </th>
                <th className="p-3 text-sm font-semibold text-gray-500 text-right">
                  Day's Gain/Loss
                </th>
                <th className="p-3 text-sm font-semibold text-gray-500 text-right">
                  Total Gain/Loss
                </th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => (
                <tr
                  key={holding.ticker}
                  className=" border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3">
                    <div className="font-bold text-gray-800">
                      {holding.ticker}
                    </div>
                    <div className="text-sm text-gray-500">{holding.name}</div>
                  </td>
                  <td className="text-right p-3 font-medium text-gray-800">
                    {formatCurrency(holding.marketValue)}
                  </td>
                  <td className="text-right p-3 font-medium">
                    {formatGain(holding.dayGain, holding.dayGainPercent)}
                  </td>
                  <td className="text-right p-3 font-medium">
                    {formatGain(holding.totalGain, holding.totalGainPercent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
