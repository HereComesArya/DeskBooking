using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBooking.Migrations
{
    public partial class create_date_time_index : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Bookings_StartDate_EndDate",
                table: "Bookings",
                columns: new[] { "StartDate", "EndDate" });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_StartTime_EndTime",
                table: "Bookings",
                columns: new[] { "StartTime", "EndTime" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Bookings_StartDate_EndDate",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_StartTime_EndTime",
                table: "Bookings");
        }
    }
}
