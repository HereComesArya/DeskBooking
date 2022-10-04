using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBooking.Migrations
{
    public partial class added_deleteddesks_table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DeletedBookings",
                columns: table => new
                {
                    BookingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SpaceId = table.Column<int>(type: "int", nullable: false),
                    DeskId = table.Column<int>(type: "int", nullable: false),
                    IsRepeating = table.Column<bool>(type: "bit", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeletedBookings", x => x.BookingId);
                    table.ForeignKey(
                        name: "FK_DeletedBookings_Desks_SpaceId_DeskId",
                        columns: x => new { x.SpaceId, x.DeskId },
                        principalTable: "Desks",
                        principalColumns: new[] { "SpaceId", "DeskId" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DeletedBookings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DeletedBookings_SpaceId_DeskId",
                table: "DeletedBookings",
                columns: new[] { "SpaceId", "DeskId" });

            migrationBuilder.CreateIndex(
                name: "IX_DeletedBookings_UserId",
                table: "DeletedBookings",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DeletedBookings");
        }
    }
}
