"use client";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_PORTFOLIO;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL_PORTFOLIO is not defined in environment variables."
  );
}

const usePortfolioUpdates = () => {
  const router = useRouter();

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/portfolioHub`)
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log("SignalR Connected."))
      .catch((err) => console.log("SignalR connection error: ", err));

    connection.on("PortfolioUpdated", (ticker: string) => {
      console.log(
        `Portfolio update received for: ${ticker}. Refreshind data...`
      );
      router.refresh();
    });

    return () => {
      connection.stop();
    };
  }, [router]);
};

export default usePortfolioUpdates;
