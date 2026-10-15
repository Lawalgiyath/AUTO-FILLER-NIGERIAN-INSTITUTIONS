# 🚀 Deployment Guide

## Deploy to Vercel (Recommended - Fastest)

Vercel is the fastest and easiest way to deploy this Next.js application.

### Method 1: Automatic Deployment (Easiest)

1. **Sign Up / Log In to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose `Lawalgiyath/AUTO-FILLER-NIGERIAN-INSTITUTIONS`
   - Click "Import"

3. **Configure Project** (Usually auto-detected)
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto)
   - Output Directory: `.next` (auto)
   - Install Command: `npm install` (auto)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - Your site will be live at `https://your-project.vercel.app`

5. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to project directory
cd AUTO-FILLER-NIGERIAN-INSTITUTIONS

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Expected Deployment Time
- ✅ Build: 1-2 minutes
- ✅ Deploy: 30-60 seconds
- ✅ **Total: ~3 minutes**

---

## Deploy to Netlify (Alternative)

### Steps

1. **Sign Up / Log In**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Import from GitHub**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select `Lawalgiyath/AUTO-FILLER-NIGERIAN-INSTITUTIONS`

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment
   - Site live at `https://random-name.netlify.app`

---

## Environment Variables

If you need to add environment variables:

### On Vercel
1. Go to Project Settings → Environment Variables
2. Add variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
   ```

### On Netlify
1. Go to Site Settings → Environment Variables
2. Add the same variables

---

## Post-Deployment Checklist

### ✅ Verify These Work:

1. **Home Page Loads**
   - Check UNILAG branding appears correctly
   - Header with logo displays properly

2. **Instructions Modal**
   - Opens on first visit
   - Checkbox must be checked to continue
   - Modal can be reopened

3. **File Upload**
   - Drag and drop works
   - Browse button works
   - File type validation works

4. **File Validation**
   - Upload `data/sample-staff-small.csv`
   - Should show 3 valid records
   - Results display correctly

5. **Error Handling**
   - Upload `data/test-with-errors.csv`
   - Should show validation errors
   - Error messages are clear

---

## Continuous Deployment

Once deployed, every push to GitHub `main` branch will automatically:
1. Trigger a new build on Vercel/Netlify
2. Run tests (if configured)
3. Deploy to production
4. Update your live site

**No manual deployment needed!**

---

## Custom Domain Setup

### For Vercel

1. **Purchase Domain** (if needed)
   - Namecheap, GoDaddy, or Vercel Domains

2. **Add to Vercel**
   - Project Settings → Domains
   - Add your domain: `unilag-autofiller.com`

3. **Configure DNS**
   - Add CNAME record:
     ```
     Type: CNAME
     Name: www (or @)
     Value: cname.vercel-dns.com
     ```

4. **Wait for Propagation**
   - Usually 5-10 minutes
   - Sometimes up to 24 hours

### For Netlify

1. **Add Domain**
   - Site Settings → Domain Management
   - Add custom domain

2. **Configure DNS**
   - Follow Netlify's DNS instructions
   - Update nameservers or add CNAME

---

## Performance Optimization

### Already Included

- ✅ Image optimization (Next.js)
- ✅ Code splitting
- ✅ Lazy loading
- ✅ CSS minification
- ✅ Gzip compression

### Additional Recommendations

1. **Add Caching Headers**
   ```js
   // next.config.js
   async headers() {
     return [
       {
         source: '/(.*).(jpg|png|svg)',
         headers: [
           {
             key: 'Cache-Control',
             value: 'public, max-age=31536000, immutable',
           },
         ],
       },
     ];
   }
   ```

2. **Enable Analytics**
   - Vercel Analytics (automatic)
   - Or add Google Analytics

---

## Monitoring

### Vercel Analytics

- Automatic for all Vercel deployments
- Shows page views, performance, errors
- Access in Project → Analytics

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay

---

## Rollback

### If Deployment Fails

**On Vercel:**
1. Go to Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

**On Netlify:**
1. Go to Deploys
2. Find working deploy
3. Click "Publish deploy"

---

## Troubleshooting

### Build Fails

**Common Issues:**

1. **Missing Dependencies**
   ```bash
   npm install
   npm run build  # Test locally
   ```

2. **Node Version Mismatch**
   - Add to `package.json`:
     ```json
     "engines": {
       "node": ">=18.0.0"
     }
     ```

3. **Environment Variables**
   - Check all required vars are set
   - Verify variable names (case-sensitive)

### Runtime Errors

1. **API Routes Not Working**
   - Check `/app/api/validate/route.js` exists
   - Verify file permissions

2. **File Upload Fails**
   - Check file size limits (default: 50MB)
   - Verify multipart/form-data handling

3. **Styles Not Loading**
   - Run `npm run build` locally
   - Check `tailwind.config.js` paths

---

## Scaling

### If You Get High Traffic

**Vercel automatically scales**, but consider:

1. **Upgrade Plan**
   - Free: 100GB bandwidth/month
   - Pro: 1TB bandwidth/month

2. **Add Edge Functions**
   - For faster global response

3. **Enable CDN Caching**
   - Already enabled by default

---

## Security

### Recommendations

1. **Add Rate Limiting**
   ```js
   // Prevent abuse of upload endpoint
   // Use middleware or edge functions
   ```

2. **File Size Limits**
   - Already limited to reasonable size
   - Adjust in `next.config.js` if needed

3. **CORS Configuration**
   - Restrict allowed origins if needed

---

## Cost

### Vercel (Recommended)

- **Hobby (Free)**: 
  - ✅ Perfect for this project
  - ✅ 100GB bandwidth
  - ✅ Unlimited requests
  - ✅ Automatic HTTPS
  - ✅ $0/month

- **Pro**: $20/month (if you need more)

### Netlify (Alternative)

- **Free Tier**:
  - ✅ 100GB bandwidth
  - ✅ 300 build minutes
  - ✅ $0/month

**Recommendation**: Start with free tier. Upgrade only if needed.

---

## Success! 🎉

Your UNILAG Staff Form AutoFiller is now live!

**Share the URL with:**
- University staff
- HR department
- Faculty administrators

**Monitor:**
- User feedback
- Error logs
- Performance metrics

---

## Support

- **GitHub Issues**: Report bugs or request features
- **Vercel Support**: For deployment issues
- **Documentation**: Check README-WEB.md

---

**Deployment Time**: ~3 minutes  
**Cost**: Free (Hobby tier)  
**Maintenance**: Automatic updates on git push
