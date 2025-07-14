using FinWiseNest.Data;
using FinWiseNest.Data.Entities;
using FinWiseNest.Data.Messaging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TransactionService.Models;

namespace TransactionService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController:ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMessageService _messageService;
        public TransactionsController(AppDbContext context, 
            IMessageService messageService)
        {
            _context = context;
            _messageService = messageService;
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
            var eventMessage = new TransactionCreatedEvent
            {
                Id = transaction.Id,
                Ticker = transaction.Ticker,
                Type = transaction.Type,
                Quantity = transaction.Quantity,
                PricePerShare = transaction.PricePerShare,
                TransactionDate = transaction.TransactionDate
            };

            await _messageService.PublishMessageAsync("transaction-events",eventMessage);

            return CreatedAtAction(nameof(CreateTransaction), new { id = transaction.Id }, transaction);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions([FromQuery] int? year)
        {
            var query = _context.Transactions.AsQueryable();

            if (year.HasValue)
            {
                query = query.Where(t => t.TransactionDate.Year == year.Value);
            }

            var transactions = await query.OrderByDescending(t => t.TransactionDate).ToListAsync();

            return Ok(transactions);
        }
    }
}
