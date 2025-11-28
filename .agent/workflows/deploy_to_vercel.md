---
description: How to push code to GitHub and deploy to Vercel
---

# Deployment Workflow

Follow these steps to push your code to GitHub and deploy it on Vercel.

## 1. Commit Your Changes
First, ensure all your local changes are committed.

```bash
git add .
git commit -m "Ready for deployment"
```

## 2. Create a GitHub Repository
1.  Go to [GitHub.com](https://github.com) and sign in.
2.  Click the **+** icon in the top right and select **New repository**.
3.  Name your repository (e.g., `kenya-prime-dwellings`).
4.  Choose **Public** or **Private**.
5.  **Do not** initialize with README, .gitignore, or License (we already have these).
6.  Click **Create repository**.

## 3. Push Code to GitHub
Copy the commands from the "…or push an existing repository from the command line" section on GitHub, or use the following (replace `YOUR_USERNAME` and `REPO_NAME`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## 4. Deploy to Vercel
1.  Go to [Vercel.com](https://vercel.com) and sign in.
2.  Click **Add New...** -> **Project**.
3.  Select **Continue with GitHub**.
4.  Find your `kenya-prime-dwellings` repository and click **Import**.
5.  **Configure Project**:
    -   **Framework Preset**: Vite (should be detected automatically).
    -   **Root Directory**: `./` (default).
    -   **Build Command**: `npm run build` (default).
    -   **Output Directory**: `dist` (default).
    -   **Environment Variables**: Add any env vars from your `.env` file if needed (e.g., Supabase keys).
6.  Click **Deploy**.

## 5. Verify
Once deployed, Vercel will give you a URL (e.g., `https://kenya-prime-dwellings.vercel.app`). Open it to verify your site is live!
