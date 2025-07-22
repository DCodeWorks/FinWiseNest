FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the .csproj files and restore dependencies
COPY ["SwissHubService/SwissHubService.csproj", "SwissHubService/"]
WORKDIR /src/SwissHubService
RUN dotnet restore "SwissHubService.csproj"

# Copy the rest of the source code
WORKDIR /src
COPY . .
WORKDIR "/src/SwissHubService"
RUN dotnet build "SwissHubService.csproj" -c Release -o /app/build

# Create the final, published output
FROM build AS publish
RUN dotnet publish "SwissHubService.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the smaller ASP.NET runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SwissHubService.dll"]