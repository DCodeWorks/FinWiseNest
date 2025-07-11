namespace SwissHubService.Models
{
    public class BuyInCalculationRequestDto
    {
        public decimal InsuredSalary { get; set; }
        public decimal CurrentPensionAssets { get; set; }
        public int Age { get; set; }
        public decimal EstimatedMarginalTaxRate { get; set; } // e.g., 25 for 25%
    }
}
