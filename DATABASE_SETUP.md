# Database Setup Guide - Aegis Management

This guide will help you set up the Neon database integration for your Aegis Management website.

## 🗄️ **Database Overview**

Your website now stores form submissions in a Neon database through Netlify Functions, including:
- **Contact Form Submissions**: Name, email, phone, service, message
- **Qualification Form Submissions**: Complete property application data
- **Metadata**: IP address, user agent, submission timestamps

## 🚀 **Setup Steps**

### 1. **Install Dependencies**
```bash
cd "Aegis Management"
npm install
```

### 2. **Environment Variables**
Create a `.env` file in your project root with:
```env
# Neon Database (automatically handled by Netlify)
NETLIFY_DATABASE_URL=your_neon_database_url

# Email Configuration
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
TEAM_EMAIL=team@aegismanagement.com
```

### 3. **Database Initialization**
After deploying to Netlify, initialize your database tables by calling:
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/init-database
```

Or visit: `https://your-site.netlify.app/.netlify/functions/init-database`

## 📊 **Database Schema**

### **Contact Form Submissions**
```sql
CREATE TABLE contact_form_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  service VARCHAR(100),
  message TEXT NOT NULL,
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT
);
```

### **Qualification Form Submissions**
```sql
CREATE TABLE qualification_form_submissions (
  id SERIAL PRIMARY KEY,
  application_id VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  -- Property details, goals, etc.
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  consent_given BOOLEAN DEFAULT FALSE
);
```

## 🔧 **Available Functions**

### **Form Processing**
- `contact-form.js` - Handles contact form submissions
- `submit-application.js` - Handles qualification form submissions

### **Database Operations**
- `db-utils.js` - Core database functions
- `init-database.js` - Database initialization
- `view-submissions.js` - View form submissions

## 📈 **Admin Dashboard**

Access your admin dashboard at: `/admin-dashboard.html`

Features:
- **Real-time statistics** of form submissions
- **Recent submissions** with detailed information
- **Auto-refresh** every 5 minutes
- **Responsive design** for mobile and desktop

## 📧 **Email Integration**

Both forms still send emails as before:
1. **Team notification** email with form details
2. **User confirmation** email thanking them
3. **Database storage** of all submission data

## 🚨 **Error Handling**

- Database errors won't prevent emails from being sent
- All errors are logged for debugging
- Graceful fallbacks ensure user experience isn't affected

## 🔒 **Security Features**

- **IP address tracking** for submission analytics
- **User agent logging** for fraud detection
- **CORS protection** on all API endpoints
- **Input validation** before database storage

## 📱 **Testing Locally**

1. **Start development server**:
   ```bash
   netlify dev
   ```

2. **Test forms** on your local site
3. **Check function logs** in the terminal
4. **Verify database operations** work correctly

## 🌐 **Deployment**

1. **Push to Git** repository connected to Netlify
2. **Netlify automatically** deploys your functions
3. **Set environment variables** in Netlify dashboard
4. **Initialize database** using the init function
5. **Test live forms** on your deployed site

## 📞 **Support**

If you encounter issues:
1. Check Netlify function logs
2. Verify environment variables are set
3. Ensure database connection is working
4. Test individual functions separately

## 🎯 **Next Steps**

After setup, consider:
- **Data export** functionality for analytics
- **Advanced filtering** in admin dashboard
- **Email templates** customization
- **Integration** with CRM systems
- **Analytics** and reporting features

---

**Your Aegis Management website now has a robust database backend that stores all form submissions while maintaining the existing email functionality!** 🎉
