# MetroHost Collective - Deployment Guide

This guide will walk you through the easiest way to publish your website on GitHub and set up a working backend for form submissions.

## 🚀 Quick Start (5 minutes)

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `metrohost-collective`
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README (we already have files)
6. Click "Create repository"

### Step 2: Upload Your Files

1. In your new repository, click "uploading an existing file"
2. Drag and drop ALL files from your `metrohost` folder
3. Click "Commit changes"

### Step 3: Enable GitHub Pages

1. Go to your repository → Settings → Pages
2. Under "Source", select "Deploy from a branch"
3. Select "main" branch and "/ (root)" folder
4. Click "Save"
5. Your site will be live at: `https://yourusername.github.io/metrohost-collective`

## 📧 Backend Setup (Netlify Functions)

### Step 4: Connect to Netlify

1. Go to [Netlify.com](https://netlify.com) and sign up/login
2. Click "New site from Git"
3. Connect your GitHub account
4. Select your `metrohost-collective` repository
5. Keep default settings and click "Deploy site"

### Step 5: Set Up Email Environment Variables

1. In Netlify dashboard, go to Site settings → Environment variables
2. Add these variables:

```
EMAIL_USER = your-gmail@gmail.com
EMAIL_PASS = your-gmail-app-password
TEAM_EMAIL = your-team-email@domain.com
```

**Important:** For `EMAIL_PASS`, you need a Gmail App Password:
1. Go to your Google Account settings
2. Security → 2-Step Verification → App passwords
3. Generate a new app password for "Mail"
4. Use that password (not your regular Gmail password)

### Step 6: Install Dependencies

1. In Netlify dashboard, go to Site settings → Build & deploy
2. Under "Build settings", set:
   - Build command: `npm install`
   - Publish directory: `.`
3. Click "Deploy site" to trigger a new build

## 🔧 Alternative: Manual Setup

If you prefer to set up locally first:

```bash
# In your metrohost folder
npm install
npm run dev
```

## 📱 What You Get

### ✅ Working Features:
- **Qualification Form**: 5-step application process
- **Contact Form**: General inquiries
- **Email Notifications**: Both forms send emails to your team
- **User Confirmations**: Auto-reply emails to users
- **Mobile Responsive**: Works on all devices
- **Free Hosting**: GitHub Pages + Netlify Functions

### 📧 Email Flow:
1. **User submits qualification form** → Email sent to your team with all details
2. **User submits contact form** → Email sent to your team
3. **Both forms** → Auto-confirmation email sent to user

## 🛠️ Customization

### Update Contact Information:
Edit `index.html` and update:
- Phone number
- Email address
- Business hours

### Update Email Templates:
Edit the functions in `functions/` folder to customize email content.

### Add Your Logo:
Replace `img/logo.png` with your actual logo.

## 🔒 Security Notes

- Environment variables are encrypted in Netlify
- Gmail app passwords are more secure than regular passwords
- CORS is properly configured for your domain
- Form validation prevents spam

## 🚨 Troubleshooting

### Forms Not Working?
1. Check Netlify function logs in dashboard
2. Verify environment variables are set
3. Test with a simple email first

### Emails Not Sending?
1. Verify Gmail app password is correct
2. Check Gmail settings allow "less secure apps"
3. Check spam folder

### Site Not Loading?
1. Check GitHub Pages settings
2. Verify all files are uploaded
3. Check for any JavaScript errors in browser console

## 📈 Next Steps

### Optional Enhancements:
1. **Custom Domain**: Point your own domain to the site
2. **Analytics**: Add Google Analytics
3. **Database**: Store submissions in a database
4. **Admin Panel**: View and manage submissions
5. **File Uploads**: Handle property photos

### Custom Domain Setup:
1. Buy domain (GoDaddy, Namecheap, etc.)
2. In Netlify: Site settings → Domain management
3. Add your custom domain
4. Update DNS records as instructed

## 💰 Cost Breakdown

- **GitHub Pages**: Free
- **Netlify Functions**: Free (125,000 requests/month)
- **Gmail**: Free (with app password)
- **Total**: $0/month

## 📞 Support

If you run into issues:
1. Check the troubleshooting section above
2. Look at Netlify function logs
3. Test locally with `npm run dev`
4. Check browser console for errors

## 🎉 You're Done!

Your MetroHost Collective website is now:
- ✅ Live on the internet
- ✅ Collecting form submissions
- ✅ Sending emails to your team
- ✅ Sending confirmations to users
- ✅ Mobile responsive
- ✅ Completely free to host

The site will automatically update when you push changes to GitHub! 