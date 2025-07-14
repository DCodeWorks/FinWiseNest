"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type AssetAllocation = {
  ticker: string;
  value: number;
};
type DashboardData = {
  totalPortfolioValue: number;
  dayChange: number;
  dayChangePercent: number;
  assetAllocation: AssetAllocation[];
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export const Dashboard = ({ data }: { data: DashboardData }) => {
  const dayChangeColor =
    data.dayChange >= 0 ? "text-green-600" : "text-red-600";
  const dayChangeSign = data.dayChange >= 0 ? "+" : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Portfolio Value Card */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-md font-medium text-gray-500 mb-2">
          Total Portfolio Value
        </h3>
        <p className="text-4xl font-bold text-gray-900">
          CHF{" "}
          {data.totalPortfolioValue.toLocaleString("de-CH", {
            minimumFractionDigits: 2,
          })}
        </p>
        <p className={`text-lg font-semibold ${dayChangeColor}`}>
          {dayChangeSign}
          {data.dayChange.toLocaleString("de-CH", {
            minimumFractionDigits: 2,
          })}{" "}
          ({dayChangeSign}
          {data.dayChangePercent.toFixed(2)}%) Today
        </p>
      </div>

      {/* Asset Allocation Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-md font-medium text-gray-500 mb-2">
          Asset Allocation
        </h3>
        <div style={{ width: "100%", height: 150 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data.assetAllocation}
                dataKey="value"
                nameKey="ticker"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
              >
                {data.assetAllocation.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  `CHF ${value.toLocaleString("de-CH")}`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
