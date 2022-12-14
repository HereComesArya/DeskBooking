global using FastEndpoints;
using DeskBooking.Data;
using DeskBooking.DTOs;
using FastEndpoints.Swagger;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddFastEndpoints();
builder.Services.AddSwaggerDoc();
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    
})
.AddCookie(options =>
{
    options.SlidingExpiration = true;

    options.Events.OnRedirectToAccessDenied = (ctx) =>
    {
        ctx.Response.StatusCode = 401;
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToLogin = (ctx) =>
    {
        ctx.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
})
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

    options.Events.OnRedirectToAuthorizationEndpoint = (ctx) =>
    {
        if (ctx.Request.Path.StartsWithSegments("/api/signin-google"))
        {
                 
            ctx.Response.Redirect(ctx.RedirectUri);
            return Task.CompletedTask;
        }

        ctx.Response.StatusCode = 401;
        return Task.CompletedTask;
    };

    //options.Events.OnAccessDenied = (ctx) =>
    //{
    //    ctx.Response.StatusCode = 401;
    //    return Task.CompletedTask;
    //};
}).AddMicrosoftAccount(microsoftOptions =>
{
    microsoftOptions.ClientId = builder.Configuration["Authentication:Microsoft:ClientId"];
    microsoftOptions.ClientSecret = builder.Configuration["Authentication:Microsoft:ClientSecret"];

    microsoftOptions.Events.OnRedirectToAuthorizationEndpoint = (ctx) =>
    {
        if (ctx.Request.Path.StartsWithSegments("/api/signin-ms"))
        {
            ctx.Response.Redirect(ctx.RedirectUri);
            return Task.CompletedTask;
        }

        ctx.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
});

builder.Services.AddHttpClient();

builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration["ConnectionStrings:MySqlString"]);
});

builder.Services.AddSpaStaticFiles(config =>
{
    config.RootPath = "dist";
});
builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles); 

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireClaim("Auth"));
});

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();

app.UseHttpLogging();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseFastEndpoints();
app.UseOpenApi();
app.UseSwaggerUi3(s => s.ConfigureDefaults());

app.UseEndpoints(endpoints =>
{
    endpoints.MapDefaultControllerRoute();
});

app.UseSpaStaticFiles();
app.UseSpa(config =>
{
    if (app.Environment.IsDevelopment())
    {
        config.UseProxyToSpaDevelopmentServer("http://127.0.0.1:5173/");
    }
});

app.Run();