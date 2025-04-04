# ----- Build stage -----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy everything and publish
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /out

# ----- Runtime stage -----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .

# Tell Railway how to start your app
ENTRYPOINT ["dotnet", "server.dll"]
