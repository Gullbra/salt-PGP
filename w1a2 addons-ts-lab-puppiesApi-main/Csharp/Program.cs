using Csharp.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
Db db = new();
builder.Services.AddSingleton<Db>(db);
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

/*
dotnet watch run --urls http://localhost:5001
*/
// Calling our endpoint with Swagger