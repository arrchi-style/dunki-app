var builder = WebApplication.CreateBuilder(args);

// --- 1. Реєстрація сервісів (DI Container) ---
builder.Services.AddControllers(); 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// --- 2. Налаштування Pipeline (Middleware) ---

// Swagger має бути на самому початку
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = "swagger"; 
});

// Важливий порядок для CORS: Routing -> CORS -> Endpoints
app.UseRouting(); 
app.UseCors();

app.MapControllers(); 

app.Run();

// Модель можна залишити внизу
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}