# Use the .NET SDK to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the solution and project files
COPY MyBlog.sln ./
COPY MyBlog.API/MyBlog.API.csproj MyBlog.API/
COPY MyBlog.Application/MyBlog.Application.csproj MyBlog.Application/
COPY MyBlog.Core/MyBlog.Core.csproj MyBlog.Core/
COPY MyBlog.Infrastructure/MyBlog.Infrastructure.csproj MyBlog.Infrastructure/

# Restore dependencies
RUN dotnet restore

# Copy the rest of the code and build
COPY . ./
RUN dotnet publish MyBlog.API/MyBlog.API.csproj -c Release -o out

# Use the .NET runtime to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Set the entry point
ENTRYPOINT ["dotnet", "MyBlog.API.dll"]
