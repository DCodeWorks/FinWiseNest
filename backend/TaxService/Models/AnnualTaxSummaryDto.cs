namespace TaxService.Models
{
    public class AnnualTaxSummaryDto
    {
        public int Year { get; set; }
        public decimal TotalDividends { get; set; }
        public decimal TotalCapitalGains { get; set; } // Note: Generally not taxed for private investors in CH but good to track
        public decimal TotalCapitalLosses { get; set; }
    }
}
