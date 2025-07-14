"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DataPoint = {
  date: string;
  value: number;
};

interface PerformanceChartProps {
  data: DataPoint[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  // Custom tooltip for better formatting
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white border border-gray-300 rounded-md shadow-sm">
          <p className="label font-bold">{`${label}`}</p>
          <p className="intro text-blue-600">{`Value: CHF ${payload[0].value.toLocaleString(
            "de-CH"
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            stroke="gray"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="gray"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              `CHF ${new Intl.NumberFormat("de-CH").format(value)}`
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
