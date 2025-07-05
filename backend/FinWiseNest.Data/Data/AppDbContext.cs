using FinWiseNest.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinWiseNest.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options) { }

        public DbSet<Holding> Holdings { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
    }
}
