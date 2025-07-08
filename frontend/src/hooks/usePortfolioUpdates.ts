'use client'
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const usePortfolioUpdates = () => {
  const router = useRouter();

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/portfolioHub")
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
