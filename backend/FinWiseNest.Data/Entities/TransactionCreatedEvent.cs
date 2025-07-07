using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinWiseNest.Data.Entities
{
    public  class TransactionCreatedEvent
    {
        public int Id { get; set; }
        public DateTime TransactionDate { get; set; }
        public required string Ticker { get; set; }
        public TransactionType Type { get; set; }
        public int Quantity { get; set; }
        public decimal PricePerShare { get; set; }
    }
}
