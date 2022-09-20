using DeskBooking.Models;
using Microsoft.EntityFrameworkCore;

namespace DeskBooking.Data
{
    public class DataContext :DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } 
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Desk> Desks { get; set; }
        public DbSet<AdminUser> AdminUsers { get; set; }
        public DbSet<Space> Spaces { get; set; }
    }
}
