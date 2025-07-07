using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinWiseNest.Data.Entities
{
    public class Holding
    {
        [Key] // Marks this as the primary key
        public int Id { get; set; }
        public required string Ticker { get; set; }
        public required string Name { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal MarketValue { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal DayGain { get; set; }
        public double DayGainPercent { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalGain { get; set; }
        public double TotalGainPercent { get; set; }
        public int Quantity { get; set; }
    }
}
