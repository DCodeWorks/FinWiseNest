FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the .csproj files and restore dependencies
COPY ["MarketDataService/MarketDataService.csproj", "MarketDataService/"]
WORKDIR /src/MarketDataService
RUN dotnet restore "MarketDataService.csproj"

# Copy the rest of the source code
WORKDIR /src
COPY . .
WORKDIR "/src/MarketDataService"
RUN dotnet build "MarketDataService.csproj" -c Release -o /app/build

# Create the final, published output
FROM build AS publish
RUN dotnet publish "MarketDataService.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the smaller ASP.NET runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MarketDataService.dll"]