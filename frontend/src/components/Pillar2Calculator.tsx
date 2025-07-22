// src/components/Pillar2Calculator.tsx
"use client";

import React, { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_SWISS_HUB;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL_SWISS_HUB is not defined in environment variables."
  );
}

type CalculationResult = {
  maxPotentialBuyIn: number;
  estimatedTaxSavings: number;
};

export const Pillar2Calculator = () => {
  const [insuredSalary, setInsuredSalary] = useState<number | string>("");
  const [currentAssets, setCurrentAssets] = useState<number | string>("");
  const [age, setAge] = useState<number | string>("");
  const [taxRate, setTaxRate] = useState<number | string>(30);

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    const requestData = {
      insuredSalary: Number(insuredSalary),
      currentPensionAssets: Number(currentAssets),
      age: Number(age),
      estimatedMarginalTaxRate: Number(taxRate),
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/pension/calculate-buy-in`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to calculate. Please check your inputs.");
      }

      const data: CalculationResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-1">
        Pillar 2 Buy-in Calculator
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Estimate your potential pension buy-in and tax savings.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="insured-salary"
            className="block text-sm font-medium text-gray-700"
          >
            Insured Salary (Lohn)
          </label>
          <input
            type="number"
            id="insured-salary"
            value={insuredSalary}
            onChange={(e) => setInsuredSalary(e.target.value)}
            required
            className="mt-1 w-full h-[35px] px-[10px] border border-gray-300 rounded-md"
            placeholder="80000"
          />
        </div>

        <div>
          <label
            htmlFor="current-assets"
            className="block text-sm font-medium text-gray-700"
          >
            Current Pension Assets (Altersguthaben)
          </label>
          <input
            type="number"
            id="current-assets"
            value={currentAssets}
            onChange={(e) => setCurrentAssets(e.target.value)}
            required
            className="mt-1 w-full h-[35px] px-[10px] border border-gray-300 rounded-md"
            placeholder="250000"
          />
        </div>

        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700"
          >
            Current Age
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="mt-1 w-full h-[35px] px-[10px] border border-gray-300 rounded-md"
            placeholder="45"
          />
        </div>

        <div>
          <label
            htmlFor="p2-tax-rate"
            className="block text-sm font-medium text-gray-700"
          >
            Estimated Marginal Tax Rate (%)
          </label>
          <input
            type="number"
            id="p2-tax-rate"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            required
            className="mt-1 w-full h-[35px] px-[10px] border border-gray-300 rounded-md"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {isLoading ? "Calculating..." : "Calculate Potential Buy-in"}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg space-y-2">
          <div>
            <p className="text-sm text-green-800">
              Max. Potential Buy-in Amount:
            </p>
            <p className="text-2xl font-bold text-green-900">
              CHF {result.maxPotentialBuyIn.toLocaleString("de-CH")}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-800">
              Estimated Tax Savings on this Amount:
            </p>
            <p className="text-2xl font-bold text-green-900">
              CHF {result.estimatedTaxSavings.toLocaleString("de-CH")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
