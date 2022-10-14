﻿// <auto-generated />
using System;
using DeskBooking.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace DeskBooking.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20221007054049_configure_cascade_delete")]
    partial class configure_cascade_delete
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("DeskBooking.Models.AdminUser", b =>
                {
                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Email");

                    b.ToTable("AdminUsers");
                });

            modelBuilder.Entity("DeskBooking.Models.Booking", b =>
                {
                    b.Property<int>("BookingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("BookingId"), 1L, 1);

                    b.Property<bool>("Cancelled")
                        .HasColumnType("bit");

                    b.Property<int?>("DeskId")
                        .HasColumnType("int");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("EndTime")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsRepeating")
                        .HasColumnType("bit");

                    b.Property<int?>("SpaceId")
                        .HasColumnType("int");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("StartTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("BookingId");

                    b.HasIndex("UserId");

                    b.HasIndex("SpaceId", "DeskId");

                    b.ToTable("Bookings");
                });

            modelBuilder.Entity("DeskBooking.Models.Desk", b =>
                {
                    b.Property<int>("SpaceId")
                        .HasColumnType("int");

                    b.Property<int>("DeskId")
                        .HasColumnType("int");

                    b.Property<float>("Xcoordinate")
                        .HasColumnType("real");

                    b.Property<float>("Ycoordinate")
                        .HasColumnType("real");

                    b.HasKey("SpaceId", "DeskId");

                    b.ToTable("Desks");
                });

            modelBuilder.Entity("DeskBooking.Models.Space", b =>
                {
                    b.Property<int>("SpaceId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SpaceId"), 1L, 1);

                    b.Property<bool>("DefaultImage")
                        .HasColumnType("bit");

                    b.Property<byte[]>("FloorImage")
                        .HasColumnType("varbinary(max)");

                    b.Property<int>("InitialDeskNo")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("SpaceId");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Spaces");
                });

            modelBuilder.Entity("DeskBooking.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserId"), 1L, 1);

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("DeskBooking.Models.Booking", b =>
                {
                    b.HasOne("DeskBooking.Models.User", "User")
                        .WithMany("Bookings")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DeskBooking.Models.Desk", "Desk")
                        .WithMany("Bookings")
                        .HasForeignKey("SpaceId", "DeskId")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.Navigation("Desk");

                    b.Navigation("User");
                });

            modelBuilder.Entity("DeskBooking.Models.Desk", b =>
                {
                    b.HasOne("DeskBooking.Models.Space", "Space")
                        .WithMany("Desks")
                        .HasForeignKey("SpaceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Space");
                });

            modelBuilder.Entity("DeskBooking.Models.Desk", b =>
                {
                    b.Navigation("Bookings");
                });

            modelBuilder.Entity("DeskBooking.Models.Space", b =>
                {
                    b.Navigation("Desks");
                });

            modelBuilder.Entity("DeskBooking.Models.User", b =>
                {
                    b.Navigation("Bookings");
                });
#pragma warning restore 612, 618
        }
    }
}
