using FinWiseNest.Data;
using FinWiseNest.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioService.Models;
using System.Text.Json;

namespace PortfolioService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PortfolioController : ControllerBase
    {
        private readonly AppDbContext _portfolioDbContext;
        private readonly IHttpClientFactory _httpClientFactory;

        public PortfolioController(AppDbContext dbContext, IHttpClientFactory httpClientFactory)
        {
            _portfolioDbContext = dbContext;
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HoldingDto>>> GetHoldings() {
            var holdings = await _portfolioDbContext.Holdings
                .ToListAsync();

            if (!holdings.Any())
            {
                await SeedAndGetHoldings();
            }

            var holdingsDto = new List<HoldingDto>();

            var client = _httpClientFactory.CreateClient();

            foreach (var holding in holdings)
            {
                decimal currentPrice = 0;
                var response = await client.GetAsync($"http://localhost:5002/api/marketdata/price/{holding.Ticker}");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadFromJsonAsync<JsonElement>();
                    currentPrice = content.GetProperty("price").GetDecimal();
                }
                holdingsDto.Add(new HoldingDto {
                    Ticker = holding.Ticker,
                    Name = holding.Name,
                    Quantity = holding.Quantity,
                    MarketValue = holding.Quantity * currentPrice,
                    DayGain = 0, 
                    TotalGain = 0,
                });
            }


            

            return Ok(holdingsDto);
        }

        [HttpGet("dashboard-summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetDashboardSummary()
        {
            var holdings = await _portfolioDbContext.Holdings.ToListAsync();

            if (!holdings.Any())
            {
                return Ok(new DashboardSummaryDto());
            }

            var totalValue = holdings.Sum(h => h.MarketValue);
            var dayChange = holdings.Sum(h => h.DayGain);
            var previousDayValue = totalValue - dayChange;

            var summary = new DashboardSummaryDto
            {
                TotalPortfolioValue = totalValue,
                DayChange = dayChange,
                DayChangePercent = previousDayValue != 0 ? (double)(dayChange / previousDayValue) * 100 : 0,
                AssetAllocation = holdings.Select(h => new AssetAllocationDto
                {
                    Ticker = h.Ticker,
                    Value = h.MarketValue
                }).ToList()
            };

            return Ok(summary);
        }

        [HttpGet("performance-history")]
        public ActionResult<PortfolioHistoryDto> GetPerformanceHistory([FromQuery] string range = "1M")
        {
            // This is mock data generation. A real implementation would require
            // complex calculations based on historical holdings and prices.
            var history = new PortfolioHistoryDto();
            var random = new Random();
            decimal lastValue = 238000; // Start value

            for (int i = 30; i >= 0; i--)
            {
                // Simulate slight daily changes
                var change = (decimal)(random.NextDouble() * 2 - 1) * 1000;
                lastValue += change;
                history.History.Add(new DataPointDto
                {
                    Date = DateTime.Now.AddDays(-i).ToString("MMM dd"),
                    Value = Math.Round(lastValue, 2)
                });
            }

            return Ok(history);
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
