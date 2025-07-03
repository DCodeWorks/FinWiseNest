using Microsoft.AspNetCore.Mvc;
using PortfolioService.Models;

namespace PortfolioService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PortfolioController : ControllerBase
    {
        private static readonly List<HoldingDto> _holdings = new()
    {
        new() { Ticker = "ROG.SW", Name = "Roche Holding AG", MarketValue = 95450.75m, DayGain = 340.10m, DayGainPercent = 0.36m, TotalGain = 8120.50m, TotalGainPercent = 9.29m },
        new() { Ticker = "IWDA.AS", Name = "iShares MSCI World ETF", MarketValue = 62100.20m, DayGain = -150.40m, DayGainPercent = -0.24m, TotalGain = 4500.00m, TotalGainPercent = 7.81m },
        new() { Ticker = "NESN.SW", Name = "Nestlé S.A.", MarketValue = 45300.00m, DayGain = 112.00m, DayGainPercent = 0.25m, TotalGain = 2330.90m, TotalGainPercent = 5.42m },
        new() { Ticker = "AAPL", Name = "Apple Inc.", MarketValue = 35870.50m, DayGain = -55.80m, DayGainPercent = -0.16m, TotalGain = 11840.10m, TotalGainPercent = 49.27m }
    };

        [HttpGet]
        public ActionResult<IEnumerable<HoldingDto>> GetHoldings() {
            return Ok(_holdings);
        }
    }
}
