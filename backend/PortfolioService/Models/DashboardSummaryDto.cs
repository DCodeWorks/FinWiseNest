namespace PortfolioService.Models
{
    public class DashboardSummaryDto
    {
        public decimal TotalPortfolioValue { get; set; }
        public decimal DayChange { get; set; }
        public double DayChangePercent { get; set; }
        public List<AssetAllocationDto> AssetAllocation { get; set; } = new();
    }
}
