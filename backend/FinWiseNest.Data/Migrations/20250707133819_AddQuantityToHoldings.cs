using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinWiseNest.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddQuantityToHoldings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Holdings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
        table: "Transactions",
        columns: new[] {"TransactionDate", "Ticker", "Type", "Quantity", "PricePerShare", "TotalAmount" },
        values: new object[,]
        {
            { new DateTime(2024, 1, 15, 10, 0, 0, DateTimeKind.Utc), "AAPL", 0, 10, 185.50m, 1855.00m },
            { new DateTime(2024, 1, 20, 11, 30, 0, DateTimeKind.Utc), "GOOG", 0, 5, 145.20m, 726.00m },
            { new DateTime(2024, 2, 10, 14, 0, 0, DateTimeKind.Utc), "MSFT", 0, 10, 410.00m, 4100.00m },
            { new DateTime(2024, 5, 5, 9, 45, 0, DateTimeKind.Utc), "AAPL", 0, 5, 170.10m, 850.50m },
            { new DateTime(2024, 6, 12, 16, 0, 0, DateTimeKind.Utc), "MSFT", 0, 5, 430.75m, 2153.75m },
            { new DateTime(2024, 9, 1, 12, 0, 0, DateTimeKind.Utc), "GOOG", 1, 2, 175.00m, 350.00m },
            { new DateTime(2024, 11, 15, 18, 0, 0, DateTimeKind.Utc), "AAPL", 2, 15, 0.24m, 3.60m },
            { new DateTime(2025, 2, 20, 10, 10, 0, DateTimeKind.Utc), "NESN.SW", 0, 20, 95.50m, 1910.00m }
        });

            migrationBuilder.InsertData(
                table: "Holdings",
                columns: new[] { "Ticker", "Name", "Quantity", "MarketValue", "DayGain", "DayGainPercent", "TotalGain", "TotalGainPercent" },
                values: new object[,]
                {
            { "AAPL", "Apple Inc.", 15, 0m, 0m, 0.0, 0m, 0.0 },
            { "GOOG", "Alphabet Inc.", 3, 0m, 0m, 0.0, 0m, 0.0 },
            { "MSFT", "Microsoft Corp.", 15, 0m, 0m, 0.0, 0m, 0.0 },
            { "NESN.SW", "Nestlé S.A.", 20, 0m, 0m, 0.0, 0m, 0.0 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Holdings");
        }
    }
}
