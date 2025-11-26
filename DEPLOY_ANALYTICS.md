# Deploy Analytics to Production

Your Google Analytics is configured locally and working. To deploy it to production (https://72ai.in), follow these steps:

## Step 1: Add Environment Variable to GitHub

1. Go to your GitHub repository:
   ```
   https://github.com/mandar-gite/ailabs_website/settings/variables/actions
   ```

2. Click **"New repository variable"**

3. Add the variable:
   - **Name:** `PUBLIC_GA4_ID`
   - **Value:** `G-QWVMR5E9MM`

4. Click **"Add variable"**

## Step 2: Update GitHub Actions Workflow

Your `.github/workflows/deploy.yml` needs to use this variable during the build.

Check if the workflow includes environment variables. If not, add this to the build step:

```yaml
- name: Build
  run: npm run build
  env:
    PUBLIC_GA4_ID: ${{ vars.PUBLIC_GA4_ID }}
```

## Step 3: Deploy

Once the variable is set, just push any change:

```bash
git push origin main
```

Or trigger a manual deployment from GitHub Actions.

## Step 4: Verify Production

1. Visit https://72ai.in
2. Open DevTools > Network tab
3. Look for `google-analytics.com` requests
4. Check GA4 Realtime report - you should see your visit

---

## Alternative: Quick Deploy Now

If you want analytics live immediately without configuring GitHub Actions, you can temporarily add the tracking ID directly to the Layout.astro file (not recommended for security):

```astro
const GA4_ID = import.meta.env.PUBLIC_GA4_ID || 'G-QWVMR5E9MM';
```

Then commit and push. But the proper way is to use GitHub repository variables.

---

## Troubleshooting

**If analytics doesn't work in production:**

1. Check GitHub Actions build logs for environment variable
2. Verify the variable is named exactly `PUBLIC_GA4_ID`
3. View source of live site - search for "googletagmanager"
4. If script is missing, environment variable wasn't passed to build

**Need help?** Let me know and I can update the GitHub Actions workflow for you.
# Analytics Tracking Active

Google Analytics 4 is now configured and tracking website traffic.

Tracking ID: G-QWVMR5E9MM

Monitor your analytics at: https://analytics.google.com/

