FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the .csproj files and restore dependencies
COPY ["TaxService/TaxService.csproj", "TaxService/"]
# Note: Add COPY lines for any other projects your service references
COPY ["FinWiseNest.Data/FinWiseNest.Data.csproj", "FinWiseNest.Data/"]
WORKDIR /src/TaxService
RUN dotnet restore "TaxService.csproj"

# Copy the rest of the source code
WORKDIR /src
COPY . .
WORKDIR "/src/TaxService"
RUN dotnet build "TaxService.csproj" -c Release -o /app/build

# Create the final, published output
FROM build AS publish
RUN dotnet publish "TaxService.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the smaller ASP.NET runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TaxService.dll"]