# Deployment Guide - DigitalOcean App Platform

This guide will help you deploy your TODO app to DigitalOcean App Platform with the following specifications:
- **Region**: Toronto (tor)
- **Database**: MongoDB (dev instance)
- **Instances**: 2 running instances
- **Environment**: Production-ready

## Prerequisites

1. **DigitalOcean Account**: You need a DigitalOcean account
2. **doctl CLI**: Install the DigitalOcean CLI tool
3. **GitHub Repository**: Your code should be in a GitHub repository

## Step 1: Install doctl CLI

### macOS
```bash
brew install doctl
```

### Linux
```bash
snap install doctl
```

### Windows
Download from: https://github.com/digitalocean/doctl/releases

## Step 2: Authenticate with DigitalOcean

```bash
doctl auth init
```

Enter your DigitalOcean API token when prompted.

## Step 3: Update Configuration

Before deploying, update the `.do/app.yaml` file:

1. **Replace the GitHub repository**:
   ```yaml
   github:
     repo: YOUR_USERNAME/YOUR_REPO_NAME
     branch: main
   ```

2. **Verify the configuration**:
   - Region: `tor` (Toronto)
   - Instance count: `2`
   - Database: MongoDB 7.0 (dev instance)
   - Environment variables are properly configured

## Step 4: Deploy the Application

### Option A: Using the deployment script
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option B: Manual deployment
```bash
doctl apps create --spec .do/app.yaml
```

## Step 5: Monitor Deployment

Check the deployment status:
```bash
# List all apps
doctl apps list

# Get specific app details
doctl apps get <APP_ID>

# View logs
doctl apps logs <APP_ID>
```

## Step 6: Access Your Application

Once deployed, you'll get a URL like:
```
https://your-app-name-xxxxx.ondigitalocean.app
```

## Configuration Details

### App Specification (`.do/app.yaml`)

```yaml
name: todo-app
region: tor
services:
  - name: web
    source_dir: /
    github:
      repo: your-username/todo-app
      branch: main
    run_command: npm start
    build_command: npm run build
    environment_slug: node-js
    instance_count: 2
    instance_size_slug: basic-xxs
    envs:
      - key: MONGODB_URI
        value: ${db.DATABASE_URL}
        scope: RUN_TIME
      - key: NODE_ENV
        value: production
        scope: RUN_TIME

databases:
  - name: db
    engine: MONGODB
    version: "7.0"
    production: false
```

### Key Features:

1. **Toronto Region**: `region: tor`
2. **2 Instances**: `instance_count: 2`
3. **MongoDB Database**: Automatically provisioned and connected
4. **Environment Variables**: MongoDB connection string automatically injected
5. **Production Build**: Uses optimized Docker build

## Environment Variables

The following environment variables are automatically configured:

- `MONGODB_URI`: Connection string to the MongoDB database
- `NODE_ENV`: Set to "production"

## Scaling and Management

### View App Status
```bash
doctl apps list
```

### Scale Instances
```bash
doctl apps update <APP_ID> --spec .do/app.yaml
```

### View Logs
```bash
doctl apps logs <APP_ID>
```

### Update App
```bash
doctl apps update <APP_ID> --spec .do/app.yaml
```

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check the build logs for dependency issues
2. **Database Connection**: Verify the MongoDB connection string is properly set
3. **Environment Variables**: Ensure all required env vars are configured

### Useful Commands:

```bash
# Check app status
doctl apps list

# View detailed app info
doctl apps get <APP_ID>

# View logs
doctl apps logs <APP_ID>

# Update app
doctl apps update <APP_ID> --spec .do/app.yaml

# Delete app (if needed)
doctl apps delete <APP_ID>
```

## Cost Estimation

- **App Instances**: 2 × basic-xxs = ~$12/month
- **MongoDB Database**: Dev instance = ~$15/month
- **Total**: ~$27/month

## Security Notes

- The MongoDB database is automatically secured
- Environment variables are encrypted
- The app runs in an isolated environment
- HTTPS is automatically enabled

## Next Steps

After deployment:

1. **Test the application**: Verify all features work correctly
2. **Monitor performance**: Check logs and metrics
3. **Set up monitoring**: Consider adding alerts
4. **Backup strategy**: Set up database backups if needed

Your TODO app is now deployed and ready to use! 🎉

