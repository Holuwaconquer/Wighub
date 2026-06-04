# Render Deployment Guide

This project is configured for deployment on Render using the `render.yaml` file.

## Prerequisites

1. Create a Render account at https://render.com
2. Connect your GitHub repository to Render

## Required Environment Secrets

**Note**: The render.yaml file uses placeholder values. You'll need to set the actual environment variables in Render dashboard after deployment.

### Backend Environment Variables (for wigstore-backend service)
Set these in your Render service settings under "Environment":

- `CLIENT_URL`: Your frontend URL (e.g., `https://your-frontend.onrender.com`)
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT signing (generate a strong one)
- `EMAIL_HOST`: SMTP host (default: `smtp.gmail.com`)
- `EMAIL_USER`: Your email address
- `EMAIL_PASS`: Your email app password
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `ADMIN_EMAIL`: Admin email for initial login (default: `admin@minka.com`)
- `ADMIN_PASSWORD`: Admin password for initial login (set a secure password)

### Frontend Environment Variables (for wigstore-frontend service)
- `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.onrender.com/api`)

## Deployment Steps

1. **Push your code to GitHub** with the `render.yaml` file in the root directory

2. **Create a new Blueprint in Render**:
   - Go to your Render dashboard
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository and branch
   - Render will automatically detect the `render.yaml` file

3. **Deploy**:
   - Click "Create Blueprint" in Render
   - Render will create two services: backend and frontend
   - The services will initially deploy with placeholder environment variables

4. **Configure Environment Variables**:
   - After deployment, go to each service in Render dashboard
   - Navigate to "Environment" settings
   - Update the environment variables with your actual values (see list above)
   - Redeploy each service after updating environment variables

## Service Configuration

### Backend Service (wigstore-backend)
- **Type**: Web Service
- **Runtime**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Port**: 5000

### Frontend Service (wigstore-frontend)
- **Type**: Static Site
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `./dist`
- **Routes**: SPA routing configured for React Router

## Post-Deployment

1. **Update Environment Variables**: 
   - Set all the environment variables listed above in each service's settings
   - Make sure to update `CLIENT_URL` and `VITE_API_URL` with the actual deployed URLs
   - Redeploy each service after updating variables

2. **Database**: Make sure your MongoDB database is accessible from Render's IP addresses

3. **Admin Setup**: Use the admin credentials to log in and set up your store

4. **Test the Application**: 
   - Frontend should load at your frontend URL
   - API should be accessible at `your-backend-url.onrender.com/api`
   - Test user registration, login, and admin features

## Troubleshooting

- **Build Failures**: Check the build logs in Render dashboard
- **Environment Variables**: Ensure all secrets are properly set
- **CORS Issues**: Verify the `CLIENT_URL` matches your frontend domain exactly
- **Database Connection**: Ensure MongoDB connection string includes database name and credentials

## Domain Configuration (Optional)

To use a custom domain:
1. Go to your frontend service settings
2. Add your custom domain
3. Update DNS records as instructed
4. Update the `CLIENT_URL` secret with your custom domain