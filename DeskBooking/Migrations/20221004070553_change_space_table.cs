using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeskBooking.Migrations
{
    public partial class change_space_table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InitialDeskNo",
                table: "Spaces",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InitialDeskNo",
                table: "Spaces");
        }
    }
}
