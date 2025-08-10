# Hudson Valley Flying Circus

Pole vault website for the Hudson Valley Flying Circus academy.

## Quick Start

To run both the Angular frontend and .NET backend together:

```bash
# Development mode (default)
./deploy.sh

# Production mode
./deploy.sh -p

# Manual steps (development)
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

## Production Deployment

To deploy to your production server:

1. **Copy files to server**:
   ```bash
   # From your local machine, copy the project to ~/flying-circus on the server
   scp -r . user@your-server:~/flying-circus/
   ```

2. **Run setup script on server**:
   ```bash
   ssh user@your-server
   cd ~/flying-circus
   chmod +x setup-production.sh
   ./setup-production.sh
   ```

The setup script will:
- Install dependencies (nginx, certbot, .NET)
- Build the application from source in `~/flying-circus`
- Deploy to `/var/www/hvfc`
- Configure nginx and systemd service
- Set up firewall rules

3. **Set up SSL** (optional):
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```