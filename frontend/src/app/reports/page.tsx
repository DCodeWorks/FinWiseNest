// src/app/reports/page.tsx
"use client";

import { useState } from "react";

// This should match the DTO from your TaxService
type TaxSummary = {
  year: number;
  totalDividends: number;
  totalCapitalGains: number;
  totalCapitalLosses: number;
};

export default function ReportsPage() {
  const [year, setYear] = useState(new Date().getFullYear() - 1);
  const [summary, setSummary] = useState<TaxSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchSummary = async () => {
    setIsLoading(true);
    setError("");
    setSummary(null);
    // Ensure this port matches your running TaxService
    const apiUrl = `http://localhost:5004/api/tax/summary/${year}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(
          "Failed to fetch tax summary. Please ensure the service is running."
        );
      }
      const data: TaxSummary = await response.json();
      setSummary(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tax Reports</h1>
        <p className="text-md text-gray-600 mt-2">
          Generate annual summaries for your tax declaration.
        </p>
      </header>

      <main className="bg-white p-6 rounded-lg shadow-sm max-w-2xl">
        <div className="flex items-end gap-4 mb-6">
          <div>
            <label
              htmlFor="tax-year"
              className="block text-sm font-medium text-gray-700"
            >
              Select Tax Year
            </label>
            <select
              id="tax-year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="mt-1 h-[40px] px-3 border border-gray-300 rounded-md"
            >
              <option>{new Date().getFullYear() - 1}</option>
              <option>{new Date().getFullYear() - 2}</option>
              <option>{new Date().getFullYear() - 3}</option>
            </select>
          </div>
          <button
            onClick={handleFetchSummary}
            disabled={isLoading}
            className="h-[40px] bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {isLoading ? "Generating..." : "Generate Summary"}
          </button>
        </div>

        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
        )}

        {summary && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              Summary for {summary.year}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">
                  Total Dividends Received
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  CHF {summary.totalDividends.toLocaleString("de-CH")}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">
                  Realized Capital Gains
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  CHF {summary.totalCapitalGains.toLocaleString("de-CH")}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
