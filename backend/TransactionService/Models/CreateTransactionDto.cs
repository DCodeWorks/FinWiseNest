using FinWiseNest.Data.Entities;
using System.ComponentModel.DataAnnotations;

namespace TransactionService.Models
{
    public class CreateTransactionDto
    {
        [Required]
        public DateTime TransactionDate { get; set; }

        [Required]
        [MinLength(1)]
        public required string Ticker { get; set; }

        [Required]
        public TransactionType Type { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal PricePerShare { get; set; }
    }
}
