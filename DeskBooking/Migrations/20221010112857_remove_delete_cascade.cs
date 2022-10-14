using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBooking.Migrations
{
    public partial class remove_delete_cascade : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Desks_SpaceId_DeskId",
                table: "Bookings");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Desks_SpaceId_DeskId",
                table: "Bookings",
                columns: new[] { "SpaceId", "DeskId" },
                principalTable: "Desks",
                principalColumns: new[] { "SpaceId", "DeskId" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Desks_SpaceId_DeskId",
                table: "Bookings");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Desks_SpaceId_DeskId",
                table: "Bookings",
                columns: new[] { "SpaceId", "DeskId" },
                principalTable: "Desks",
                principalColumns: new[] { "SpaceId", "DeskId" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}
