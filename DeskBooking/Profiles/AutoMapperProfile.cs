using AutoMapper;
using DeskBooking.DTOs.Booking;
using DeskBooking.Models;

namespace DeskBooking.Profiles
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<BookingRequestDto, Booking>();
            CreateMap<Booking, BookingRequestDto>();
        }
    }
}
    