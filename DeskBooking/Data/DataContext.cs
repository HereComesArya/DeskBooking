using DeskBooking.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            
            modelBuilder.Entity<Desk>()
                .HasKey(d => new { d.SpaceId, d.DeskId });
                //.OnDelete(DeleteBehavior.ClientNoAction);


            //relationships
            modelBuilder.Entity<User>()
                .HasMany(u => u.Bookings)
                .WithOne(b => b.User);

            modelBuilder.Entity<Space>()
                .HasMany(s => s.Desks)
                .WithOne(d => d.Space);

            modelBuilder.Entity<Desk>()
                .HasMany(d => d.Bookings)
                .WithOne(b => b.Desk)
                .HasForeignKey(b => new { b.SpaceId, b.DeskId });

            //Query Filters

            modelBuilder.Entity<Desk>()
                .Property<bool>("isDeleted");
            modelBuilder.Entity<Desk>().HasQueryFilter(m => EF.Property<bool>(m, "isDeleted") == false);

            modelBuilder.Entity<Space>()
                .Property<bool>("isDeleted");
            modelBuilder.Entity<Space>().HasQueryFilter(m => EF.Property<bool>(m, "isDeleted") == false);


            //Indexing the DateTime
            modelBuilder.Entity<Booking>()
                .HasIndex(b => new { b.StartDate, b.EndDate });
            modelBuilder.Entity<Booking>()
               .HasIndex(b => new { b.StartTime, b.EndTime });

            
            //Remove time component from date time
            modelBuilder
                .Entity<Booking>()
                .Property(b => b.StartDate)
                .HasConversion(d => d.Date, d => d);

            modelBuilder
                .Entity<Booking>()
                .Property(b => b.EndDate)
                .HasConversion(d => d.Date, d => d);
           
        }

        private void UpdateSoftDeleteStatuses()
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity.GetType() == typeof(Desk) || entry.Entity.GetType() == typeof(Space))
                {
                    switch (entry.State)
                    {
                        case EntityState.Added:
                            entry.CurrentValues["isDeleted"] = false;                         
                            break;

                        case EntityState.Deleted:
                            entry.State = EntityState.Modified;
                            entry.CurrentValues["isDeleted"] = true;
                            break;
                    }
                }              
            }
        }
        public override int SaveChanges()
        {
            UpdateSoftDeleteStatuses();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            UpdateSoftDeleteStatuses();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }
    }
}
