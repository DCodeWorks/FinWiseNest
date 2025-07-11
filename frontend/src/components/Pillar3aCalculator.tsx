"use client";

import React, { useState, useMemo } from "react";
//TODO: Pillar2 - Critical Rule: The 3-Year Lock-in Period
// Official 2025 limits (TODO: this might come from a config file or API)
const MAX_WITH_PENSION_FUND = 7258;
const MAX_SELF_EMPLOYED_PERCENT = 0.2;
const MAX_SELF_EMPLOYED_CAP = 36288;

export const Pillar3aCalculator = () => {
  const [income, setIncome] = useState<number | string>("");
  const [hasPensionFund, setHasPensionFund] = useState(true);
  const [estimatedTaxRate, setEstimatedTaxRate] = useState<number | string>(25);

  const maxContribution = useMemo(() => {
    if (hasPensionFund) {
      return MAX_WITH_PENSION_FUND;
    }
    // For self-employed without a pension fund
    const calculatedMax = (Number(income) || 0) * MAX_SELF_EMPLOYED_PERCENT;
    return Math.min(calculatedMax, MAX_SELF_EMPLOYED_CAP);
  }, [income, hasPensionFund]);

  const estimatedTaxSavings = useMemo(() => {
    return maxContribution * ((Number(estimatedTaxRate) || 0) / 100);
  }, [maxContribution, estimatedTaxRate]);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-1">
        Pillar 3a Calculator
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Calculate your maximum 2025 contribution and estimated tax savings.
      </p>

      <div className="space-y-6">
        {/* Input for Pension Fund Status */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <label
            htmlFor="pension-fund-status"
            className="font-medium text-gray-700"
          >
            Do you contribute to a pension fund (Pillar 2)?
          </label>
          <div className="relative inline-flex items-center cursor-pointer" onClick={()=>setHasPensionFund(!hasPensionFund)}>
            <input
              type="checkbox"
              id="pension-fund-status"
              className="sr-only peer"
              checked={hasPensionFund}
              onChange={() => setHasPensionFund(!hasPensionFund)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
        </div>

        {/* Conditional Input for Income */}
        {!hasPensionFund && (
          <div>
            <label
              htmlFor="income"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Net Annual Income (Self-Employed)
            </label>
            <input
              type="number"
              id="income"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full h-[35px] px-[10px] border border-gray-300 rounded-md"
              placeholder="e.g., 100000"
            />
          </div>
        )}

        {/* Input for Tax Rate */}
        <div>
          <label
            htmlFor="tax-rate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Estimated Marginal Tax Rate (%)
          </label>
          <input
            type="number"
            id="tax-rate"
            value={estimatedTaxRate}
            onChange={(e) => setEstimatedTaxRate(Number(e.target.value))}
            className="w-full h-[35px] px-[10px] border border-gray-300 rounded-md"
          />
        </div>

        {/* Results Display */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg space-y-2">
          <div>
            <p className="text-sm text-blue-800">Maximum 3a Contribution:</p>
            <p className="text-2xl font-bold text-blue-900">
              CHF{" "}
              {maxContribution.toLocaleString("de-CH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-800">Estimated Tax Savings:</p>
            <p className="text-2xl font-bold text-green-900">
              CHF{" "}
              {estimatedTaxSavings.toLocaleString("de-CH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
