using AutoMapper;
using DeskBooking.DTOs.Booking;
using DeskBooking.DTOs.Desk;
using DeskBooking.Models;

namespace DeskBooking.Profiles
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<BookingRequestDto, Booking>();
            CreateMap<Booking, BookingResponseDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.FirstName + " " +src.User.LastName));
            CreateMap<DeskRequestDto, Desk>()
                .ForMember(dest => dest.SpaceId, opt => opt.Ignore())
                .ForMember(dest => dest.DeskId, opt => opt.MapFrom(src => src.id))
                .ForMember(dest => dest.Xcoordinate, opt => opt.MapFrom(src => src.x))
                .ForMember(dest => dest.Ycoordinate, opt => opt.MapFrom(src => src.y));

        }
    }
}
    