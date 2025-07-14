using FinWiseNest.Data;
using FinWiseNest.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaxService.Models;

namespace TaxService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaxController:ControllerBase
    {
        private readonly AppDbContext _context;
        public TaxController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary/{year}")]
        public async Task<ActionResult<AnnualTaxSummaryDto>> GetAnnualSummary(int year)
        {
            var startDate = new DateTime(year, 1, 1);
            var endDate = new DateTime(year, 12, 31);

            var transactions = await _context.Transactions
                // .Where(t => t.UserId == "some-user-id") // We'll add UserId later
                .Where(t => t.TransactionDate >= startDate && t.TransactionDate <= endDate)
                .ToListAsync();

            var summary = new AnnualTaxSummaryDto
            {
                Year = year,
                TotalDividends = transactions.Where(t => t.Type == TransactionType.Dividend).Sum(t => t.TotalAmount),
                TotalCapitalGains = transactions.Where(t => t.Type == TransactionType.Sell && t.TotalAmount > 0) // Simplified logic
                                                .Sum(t => t.TotalAmount - (t.Quantity * t.PricePerShare)), // This logic needs refinement
                TotalCapitalLosses = transactions.Where(t => t.Type == TransactionType.Sell && t.TotalAmount < 0) // Simplified logic
                                                 .Sum(t => t.TotalAmount - (t.Quantity * t.PricePerShare)) // This logic needs refinement
            };

            // Note: True capital gain calculation is complex and requires tracking cost basis.
            // This is a simplified example for the API structure.

            return Ok(summary);
        }
    }
}
