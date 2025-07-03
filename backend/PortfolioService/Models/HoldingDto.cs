namespace PortfolioService.Models
{
    public class HoldingDto
    {
        public required string Ticker { get; set; }
        public required string Name { get; set; }
        public decimal MarketValue { get; set; }
        public decimal DayGain { get; set; }
        public decimal DayGainPercent { get; set; }
        public decimal TotalGain { get; set; }
        public decimal TotalGainPercent { get; set; }
    }
}
