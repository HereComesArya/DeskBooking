using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBooking.Migrations
{
    public partial class removed_fk_from_deletedboookings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DeletedBookings_Desks_SpaceId_DeskId",
                table: "DeletedBookings");

            migrationBuilder.DropForeignKey(
                name: "FK_DeletedBookings_Users_UserId",
                table: "DeletedBookings");

            migrationBuilder.DropIndex(
                name: "IX_DeletedBookings_SpaceId_DeskId",
                table: "DeletedBookings");

            migrationBuilder.DropIndex(
                name: "IX_DeletedBookings_UserId",
                table: "DeletedBookings");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_DeletedBookings_SpaceId_DeskId",
                table: "DeletedBookings",
                columns: new[] { "SpaceId", "DeskId" });

            migrationBuilder.CreateIndex(
                name: "IX_DeletedBookings_UserId",
                table: "DeletedBookings",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_DeletedBookings_Desks_SpaceId_DeskId",
                table: "DeletedBookings",
                columns: new[] { "SpaceId", "DeskId" },
                principalTable: "Desks",
                principalColumns: new[] { "SpaceId", "DeskId" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DeletedBookings_Users_UserId",
                table: "DeletedBookings",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
