using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBooking.Migrations
{
    public partial class d : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "DeletedBookings",
                newName: "DUserId");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "DeletedBookings",
                newName: "DStartTime");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "DeletedBookings",
                newName: "DStartDate");

            migrationBuilder.RenameColumn(
                name: "SpaceId",
                table: "DeletedBookings",
                newName: "DSpaceId");

            migrationBuilder.RenameColumn(
                name: "IsRepeating",
                table: "DeletedBookings",
                newName: "DIsRepeating");

            migrationBuilder.RenameColumn(
                name: "EndTime",
                table: "DeletedBookings",
                newName: "DEndTime");

            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "DeletedBookings",
                newName: "DEndDate");

            migrationBuilder.RenameColumn(
                name: "DeskId",
                table: "DeletedBookings",
                newName: "DDeskId");

            migrationBuilder.RenameColumn(
                name: "BookingId",
                table: "DeletedBookings",
                newName: "DBookingId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DUserId",
                table: "DeletedBookings",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "DStartTime",
                table: "DeletedBookings",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "DStartDate",
                table: "DeletedBookings",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "DSpaceId",
                table: "DeletedBookings",
                newName: "SpaceId");

            migrationBuilder.RenameColumn(
                name: "DIsRepeating",
                table: "DeletedBookings",
                newName: "IsRepeating");

            migrationBuilder.RenameColumn(
                name: "DEndTime",
                table: "DeletedBookings",
                newName: "EndTime");

            migrationBuilder.RenameColumn(
                name: "DEndDate",
                table: "DeletedBookings",
                newName: "EndDate");

            migrationBuilder.RenameColumn(
                name: "DDeskId",
                table: "DeletedBookings",
                newName: "DeskId");

            migrationBuilder.RenameColumn(
                name: "DBookingId",
                table: "DeletedBookings",
                newName: "BookingId");
        }
    }
}
