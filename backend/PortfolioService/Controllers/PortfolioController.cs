using FinWiseNest.Data;
using FinWiseNest.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioService.Models;

namespace PortfolioService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PortfolioController : ControllerBase
    {
        private readonly AppDbContext _portfolioDbContext;

        public PortfolioController(AppDbContext dbContext)
        {
            _portfolioDbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HoldingDto>>> GetHoldings() {
            var holdings = await _portfolioDbContext.Holdings
                .Select(h => new HoldingDto 
                {
                    Ticker = h.Ticker,
                    Name = h.Name,
                    MarketValue = h.MarketValue,
                    DayGain = h.DayGain,
                    DayGainPercent = (decimal)h.DayGainPercent,
                    TotalGain = h.TotalGain,
                    TotalGainPercent = (decimal)h.TotalGainPercent
                })
                .ToListAsync();

            if (!holdings.Any())
            {
                return Ok(await SeedAndGetHoldings());
            }

            return Ok(holdings);
        }

        private async Task<IEnumerable<HoldingDto>> SeedAndGetHoldings()
        {
            var seedData = new List<Holding>
        {
            new() { Ticker = "ROG.SW", Name = "Roche Holding AG", MarketValue = 95450.75m, DayGain = 340.10m, DayGainPercent = 0.36, TotalGain = 8120.50m, TotalGainPercent = 9.29 },
            new() { Ticker = "IWDA.AS", Name = "iShares MSCI World ETF", MarketValue = 62100.20m, DayGain = -150.40m, DayGainPercent = -0.24, TotalGain = 4500.00m, TotalGainPercent = 7.81 },
            new() { Ticker = "NESN.SW", Name = "Nestlé S.A.", MarketValue = 45300.00m, DayGain = 112.00m, DayGainPercent = 0.25, TotalGain = 2330.90m, TotalGainPercent = 5.42 },
            new() { Ticker = "AAPL", Name = "Apple Inc.", MarketValue = 35870.50m, DayGain = -55.80m, DayGainPercent = -0.16, TotalGain = 11840.10m, TotalGainPercent = 49.27 }
        };

            await _portfolioDbContext.Holdings.AddRangeAsync(seedData);
            await _portfolioDbContext.SaveChangesAsync();

            // Re-query the data to return it
            return await GetHoldings().ContinueWith(t => t.Result.Value);
        }
    }
}
