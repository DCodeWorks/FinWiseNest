import { Transaction } from "../lib/portfolio/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_TRANSACTIONS;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL_TRANSACTIONS is not defined in environment variables."
  );
}

async function getTransactions(year?: string): Promise<Transaction[]> {
  let url = `${API_BASE_URL}/api/transactions`; // Ensure port is correct
  if (year) {
    url += `?year=${year}`;
  }

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}

const transactionTypeMap: { [key: number]: string } = {
  0: "Buy",
  1: "Sell",
  2: "Dividend",
  3: "Interest",
};

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams?: { year?: string };
}) {
  const year = searchParams?.year;
  const transactions = await getTransactions(year);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        <p className="text-md text-gray-600 mt-2">
          A complete history of your financial activities.
        </p>
      </header>

      <main className="bg-white p-6 rounded-lg shadow-sm">
        {/* TODO: Add a filter UI component here */}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-500">
                  Date
                </th>
                <th className="p-3 text-sm font-semibold text-gray-500">
                  Ticker
                </th>
                <th className="p-3 text-sm font-semibold text-gray-500">
                  Type
                </th>
                <th className="p-3 text-sm font-semibold text-gray-500 text-right">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3 text-sm text-gray-700">
                    {new Date(tx.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm font-bold text-gray-800">
                    {tx.ticker}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {transactionTypeMap[tx.type] || "Unknown"}
                  </td>
                  <td className="p-3 text-sm text-right font-medium">
                    CHF {tx.totalAmount.toLocaleString("de-CH")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No transactions found for the selected criteria.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
