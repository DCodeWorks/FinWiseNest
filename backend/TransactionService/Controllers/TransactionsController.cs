using FinWiseNest.Data;
using FinWiseNest.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using TransactionService.Models;

namespace TransactionService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController:ControllerBase
    {
        private readonly AppDbContext _context;
        public TransactionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionDto transactionDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var transaction = new Transaction
            {
                TransactionDate = transactionDto.TransactionDate.ToUniversalTime(),
                Ticker = transactionDto.Ticker.ToUpper(),
                Type = transactionDto.Type,
                Quantity = transactionDto.Quantity,
                PricePerShare = transactionDto.PricePerShare,
                TotalAmount = transactionDto.Quantity * transactionDto.PricePerShare
            };

            await _context.Transactions.AddAsync(transaction);
            await _context.SaveChangesAsync();

            // TODO: publish a 'TransactionCreated' event 
            // to the Azure Service Bus here.

            return CreatedAtAction(nameof(CreateTransaction), new { id = transaction.Id }, transaction);
        }
    }
}
