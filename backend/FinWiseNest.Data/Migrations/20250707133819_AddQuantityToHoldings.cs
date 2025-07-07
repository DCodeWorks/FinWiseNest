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
