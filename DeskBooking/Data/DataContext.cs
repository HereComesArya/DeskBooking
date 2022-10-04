using DeskBooking.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

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
        public DbSet<DeletedBooking> DeletedBookings { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Desk>()
                .HasKey(d => new { d.SpaceId, d.DeskId });
            //modelBuilder.Entity<Booking>()
            //    .HasOne(b => b.Desk)
            //    .WithMany()

            modelBuilder
                .Entity<Booking>()
                .Property(b => b.StartDate)
                .HasConversion(d => d.Date, d => d);

            modelBuilder
                .Entity<Booking>()
                .Property(b => b.EndDate)
                .HasConversion(d => d.Date, d => d);
        }
    }
}
