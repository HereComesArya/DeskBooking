using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;

namespace DeskBooking.Extensions
{
    public static class IdentityExtensions
    {
        public static async Task EnableIdentityInsertAsync<T>(this DbContext context) => await SetIdentityInsertAsync<T>(context, true);
        public static async Task DisableIdentityInsertAsync<T>(this DbContext context) => await SetIdentityInsertAsync<T>(context, false);

        private static async Task SetIdentityInsertAsync<T>([NotNull] DbContext context, bool enable)
        {
            if (context == null) throw new ArgumentNullException(nameof(context));
            var entityType = context.Model.FindEntityType(typeof(T));
            var value = enable ? "ON" : "OFF";
            await context.Database.ExecuteSqlRawAsync($"SET IDENTITY_INSERT {entityType.GetSchema()}.{entityType.GetTableName()} {value}");
        }

        public static async Task SaveChangesWithIdentityInsertAsync<T>([NotNull] this DbContext context)
        {
            if (context == null) throw new ArgumentNullException(nameof(context));
            await using var transaction = await context.Database.BeginTransactionAsync();
            await context.EnableIdentityInsertAsync<T>();
            await context.SaveChangesAsync();
            await context.DisableIdentityInsertAsync<T>();
            await transaction.CommitAsync();
        }

    }
}
