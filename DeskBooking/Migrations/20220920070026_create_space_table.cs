using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBooking.Migrations
{
    public partial class create_space_table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RoomId",
                table: "Desks",
                newName: "SpaceId");

            migrationBuilder.CreateTable(
                name: "Spaces",
                columns: table => new
                {
                    SpaceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FloorImage = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Spaces", x => x.SpaceId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Spaces");

            migrationBuilder.RenameColumn(
                name: "SpaceId",
                table: "Desks",
                newName: "RoomId");
        }
    }
}
