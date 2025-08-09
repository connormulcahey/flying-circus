# Hudson Valley Flying Circus

Pole vault website for the Hudson Valley Flying Circus academy.

## Quick Start - Production Mode

To run both the Angular frontend and .NET backend together:

```bash
# Option 1: Use the build script
./build-and-run.sh

# Option 2: Manual steps
cd client
npm install  # First time only
npm run build
cd ../api
dotnet run
```

Then open http://localhost:5025 in your browser.

## Development Mode

For development with hot reload:

### Terminal 1 - Start .NET API:
```bash
cd api
dotnet run
```

### Terminal 2 - Start Angular Dev Server:
```bash
cd client
npm install  # First time only
npm start
```

Then open http://localhost:4200 in your browser.

The Angular dev server will proxy API requests to the .NET backend automatically.

## Architecture

- **Frontend**: Angular 18 application
- **Backend**: .NET 9 Web API
- **Database**: In-memory database with JSON file data source
- **Data**: Posts are loaded from `posts.json` file

## Building for Production

```bash
cd client
npm run build -- --configuration production
cd ../api
dotnet publish -c Release
```

The Angular app will be built to `api/wwwroot` and served by the .NET application.