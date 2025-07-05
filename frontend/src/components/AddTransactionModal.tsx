"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

export const AddTransactionModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [ticker, setTicker] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transactionData = {
      ticker: ticker,
      quantity: parseInt(quantity, 10),
      pricePerShare: parseFloat(price),
      transactionDate: new Date(date),
      type: 0, // 0 for 'Buy'
    };

    console.log("Sending transaction data:", transactionData);

    try {
      const response = await fetch("http://localhost:5001/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      console.log("Transaction created successfully:", result);
      setIsOpen(false);
      //TODO: trigger a data refresh on porfolio page
    } catch (error) {
      console.error("Failed to create transaction:", error);
      alert("Failed to create transaction. See console for details.");
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          + Add Transaction
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-gray-800 m-0 text-[17px] font-medium">
            Add New Transaction
          </Dialog.Title>
          <Dialog.Description className="text-gray-600 mt-[10px] mb-5 text-[15px] leading-normal">
            Record a new buy or sell transaction.
          </Dialog.Description>
          <form onSubmit={handleSubmit}>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="text-gray-800 w-[90px] text-right text-[15px]"
                htmlFor="ticker"
              >
                Ticker
              </label>
              <input
                className="text-gray-800 shadow-sm focus:ring-blue-500 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none border border-gray-300"
                id="ticker"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="e.g., AAPL"
                required
              />
            </fieldset>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="text-gray-800 w-[90px] text-right text-[15px]"
                htmlFor="quantity"
              >
                Quantity
              </label>
              <input
                className="text-gray-800 shadow-sm focus:ring-blue-500 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none border border-gray-300"
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </fieldset>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="text-gray-800 w-[90px] text-right text-[15px]"
                htmlFor="price"
              >
                Price
              </label>
              <input
                className="text-gray-800 shadow-sm focus:ring-blue-500 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none border border-gray-300"
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </fieldset>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="text-gray-800 w-[90px] text-right text-[15px]"
                htmlFor="date"
              >
                Date
              </label>
              <input
                className="text-gray-800 shadow-sm focus:ring-blue-500 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none border border-gray-300"
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </fieldset>
            <div className="mt-[25px] flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white hover:bg-green-600 focus:shadow-green-700 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Save Transaction
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              className="text-gray-600 hover:bg-gray-100 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              X
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
