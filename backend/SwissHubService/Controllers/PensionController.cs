using Microsoft.AspNetCore.Mvc;
using SwissHubService.Models;

namespace SwissHubService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PensionController:ControllerBase
    {
        private const int RetirementAge = 65;

        [HttpPost("calculate-buy-in")]
        public async Task<IActionResult> CalculateBuyIn([FromBody]BuyInCalculationRequestDto request)
        {
            // This is a simplified calculation model. Real-world models depend on
            // the specific pension fund's regulations (conversion rate, contribution rates, etc.)
            if (request.Age >= RetirementAge)
            {
                return Ok(new BuyInCalculationResponseDto { MaxPotentialBuyIn = 0, EstimatedTaxSavings = 0 });
            }

            // Simplified: Assume a target retirement capital of 6x the insured salary.
            // This is a very rough estimation factor.
            decimal targetRetirementCapital = request.InsuredSalary * 6;

            decimal maxPotentialBuyIn = targetRetirementCapital - request.CurrentPensionAssets;

            // Ensure buy-in cannot be negative
            if (maxPotentialBuyIn < 0)
            {
                maxPotentialBuyIn = 0;
            }

            decimal estimatedTaxSavings = maxPotentialBuyIn * (request.EstimatedMarginalTaxRate / 100);

            var response = new BuyInCalculationResponseDto
            {
                MaxPotentialBuyIn = Math.Round(maxPotentialBuyIn, 2),
                EstimatedTaxSavings = Math.Round(estimatedTaxSavings, 2)
            };

            return Ok(response);
        }
    }
}
