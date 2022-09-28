﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DeskBooking.Models
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }
        [Required]
        public User User { get; set; }
        public int UserId { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        [Required]
        public Desk Desk { get; set; }
        public int DeskId { get; set; }

        [Required]
        public bool IsRepeating { get; set; }
        [Required]
        public DateOnly StartDate { get; set; }
        [Required]
        public DateOnly EndDate { get; set; }
    }
}
