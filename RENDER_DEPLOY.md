# Deploying FifthKeys to Render with MongoDB Atlas

This guide walks you through deploying your FifthKeys application to Render, using either the Node.js buildpack or Docker, with MongoDB Atlas.

## 1. Set Up MongoDB Atlas

Your MongoDB Atlas connection string:
```
mongodb+srv://etomita:G3q71B6UurnxeGHp@cluster0.cyfewey.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## 2a. Configure Render Deployment (Using Node.js Runtime)

This is the simpler method if you don't need fine-grained Docker control.

1. **Create a Web Service in Render**
   - Log in to your Render dashboard
   - Click "New" and select "Web Service"
   - Connect your GitHub repository (`EZASI/fifthkeys-new-demo`)
   - Name: `fifthkeys-backend`
   - Root Directory: Leave empty (use repository root)
   - Environment: `Node`
   - Branch: `main`
   - Build Command: `npm install`
   - Start Command: `node backend/index.js`
   - Plan: Free (or your preferred plan)

2. **Set Environment Variables**
   - Go to the "Environment" tab for your service.
   - Add:
     - Key: `MONGODB_URI`, Value: `mongodb+srv://etomita:G3q71B6UurnxeGHp@cluster0.cyfewey.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
     - Key: `PORT`, Value: `10000`
     - Key: `CLIENT_URL`, Value: Your frontend URL (e.g., `https://fifthkeys-frontend.onrender.com`)

3. **Deploy the Service**

---

## 2b. Configure Render Deployment (Using Docker Runtime)

Use this method if you prefer deploying with the Docker configuration we set up.

**Note:** This method assumes you have renamed `Dockerfile.backend` to `Dockerfile` in the root of your repository (`git mv Dockerfile.backend Dockerfile`).

1. **Create a Web Service in Render**
   - Log in to your Render dashboard
   - Click "New" and select "Web Service"
   - Connect your GitHub repository (`EZASI/fifthkeys-new-demo`)
   - Name: `fifthkeys-backend-docker` (or similar)
   - Root Directory: **Leave empty**
   - Environment: `Docker`
   - Branch: `main`
   - Dockerfile Path: **Leave empty** (uses default `Dockerfile`)
   - Plan: Free (or your preferred plan)

2. **Set Environment Variables**
   - Go to the "Environment" tab for your service.
   - Add:
     - Key: `MONGODB_URI`, Value: `mongodb+srv://etomita:G3q71B6UurnxeGHp@cluster0.cyfewey.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
     - Key: `PORT`, Value: `10000` (Render injects this, Dockerfile exposes 5001, Render maps 10000 -> 5001)
     - Key: `CLIENT_URL`, Value: Your frontend URL (e.g., `https://fifthkeys-frontend.onrender.com`)

3. **Deploy the Service**

---

## 3. Deploy Frontend (Static Site)

For a complete deployment, you'll also need to deploy your frontend:

1. **Create a Static Site in Render**
   - Click "New" and select "Static Site"
   - Connect your GitHub repository
   - Name: `fifthkeys-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Add Environment Variable:
     - Key: `REACT_APP_API_URL`
     - Value: Your backend URL (e.g., "https://fifthkeys-backend.onrender.com")

## 4. Troubleshooting

- **Docker Build Errors**: If using Docker, ensure `Dockerfile` exists at the root, `Root Directory` is empty, and `Dockerfile Path` is empty.
- **Connection Issues**: Make sure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs).
- **Build Errors**: Check Render logs for details
- **Runtime Errors**: Check application logs in the Render dashboard

## 5. Accessing Your Application

After deployment, your application will be available at the URLs provided by Render:
- Backend: https://fifthkeys-backend.onrender.com
- Frontend: https://fifthkeys-frontend.onrender.com 