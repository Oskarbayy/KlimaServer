# Build-stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["YourApiProject.csproj", "./"]
RUN dotnet restore "./YourApiProject.csproj"
COPY . .
RUN dotnet publish "./YourApiProject.csproj" -c Release -o /app/publish

# Runtime-stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "YourApiProject.dll"]
EXPOSE 8080
