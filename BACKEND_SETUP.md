# Backend API Setup for MetroHost Collective

When your website is published, you'll need to set up a backend API to collect user data from the qualification funnel. Here's how to implement it:

## API Endpoint

Create a POST endpoint at `/api/submit-application` to receive user data:

### Request Format
```json
{
  "property": {
    "type": "apartment",
    "bedrooms": "2",
    "bathrooms": "2",
    "squareFeet": "1200",
    "location": "New York, NY",
    "availability": "immediately",
    "description": "Beautiful apartment in downtown area"
  },
  "contact": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567"
  },
  "submissionDate": "2024-01-15T10:30:00.000Z",
  "source": "MetroHost Collective Website"
}
```

### Response Format
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "applicationId": "app_123456789"
}
```

## Implementation Examples

### Node.js/Express
```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/submit-application', async (req, res) => {
  try {
    const userData = req.body;
    
    // Validate required fields
    if (!userData.contact.email || !userData.contact.name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required'
      });
    }
    
    // Store in database (example with MongoDB)
    const application = await Application.create({
      ...userData,
      status: 'pending',
      createdAt: new Date()
    });
    
    // Send confirmation email
    await sendConfirmationEmail(userData.contact.email, userData.contact.name);
    
    // Send notification to your team
    await sendTeamNotification(userData);
    
    res.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id
    });
    
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

### Python/Flask
```python
from flask import Flask, request, jsonify
from datetime import datetime
import smtplib

app = Flask(__name__)

@app.route('/api/submit-application', methods=['POST'])
def submit_application():
    try:
        user_data = request.json
        
        # Validate required fields
        if not user_data.get('contact', {}).get('email') or not user_data.get('contact', {}).get('name'):
            return jsonify({
                'success': False,
                'message': 'Email and name are required'
            }), 400
        
        # Store in database
        application_id = store_application(user_data)
        
        # Send confirmation email
        send_confirmation_email(user_data['contact']['email'], user_data['contact']['name'])
        
        return jsonify({
            'success': True,
            'message': 'Application submitted successfully',
            'applicationId': application_id
        })
        
    except Exception as e:
        print(f"Error submitting application: {e}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500
```

### PHP
```php
<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (empty($input['contact']['email']) || empty($input['contact']['name'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email and name are required']);
        exit;
    }
    
    // Store in database
    $application_id = store_application($input);
    
    // Send confirmation email
    send_confirmation_email($input['contact']['email'], $input['contact']['name']);
    
    echo json_encode([
        'success' => true,
        'message' => 'Application submitted successfully',
        'applicationId' => $application_id
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Internal server error']);
}
?>
```

## Database Schema

### MongoDB Example
```javascript
const applicationSchema = new mongoose.Schema({
  property: {
    type: String,
    bedrooms: String,
    bathrooms: String,
    squareFeet: String,
    location: String,
    availability: String,
    description: String
  },
  contact: {
    name: String,
    email: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending'
  },
  submissionDate: Date,
  source: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### SQL Example
```sql
CREATE TABLE applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_type VARCHAR(50),
  bedrooms VARCHAR(10),
  bathrooms VARCHAR(10),
  square_feet VARCHAR(20),
  location VARCHAR(255),
  availability VARCHAR(50),
  description TEXT,
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  status ENUM('pending', 'reviewed', 'approved', 'rejected') DEFAULT 'pending',
  submission_date DATETIME,
  source VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Email Notifications

### Confirmation Email to User
```javascript
async function sendConfirmationEmail(email, name) {
  const transporter = nodemailer.createTransporter({
    host: 'your-smtp-host.com',
    port: 587,
    secure: false,
    auth: {
      user: 'your-email@domain.com',
      pass: 'your-password'
    }
  });
  
  await transporter.sendMail({
    from: 'noreply@metrohostcollective.com',
    to: email,
    subject: 'Application Received - MetroHost Collective',
    html: `
      <h2>Thank you for your application, ${name}!</h2>
      <p>We've received your property management application and will review it within 24 hours.</p>
      <p>You'll hear from our team soon with next steps.</p>
      <br>
      <p>Best regards,<br>The MetroHost Collective Team</p>
    `
  });
}
```

### Team Notification
```javascript
async function sendTeamNotification(userData) {
  const transporter = nodemailer.createTransporter({
    // SMTP configuration
  });
  
  await transporter.sendMail({
    from: 'noreply@metrohostcollective.com',
    to: 'team@metrohostcollective.com',
    subject: 'New Property Application Received',
    html: `
      <h2>New Application Received</h2>
      <h3>Property Details:</h3>
      <ul>
        <li>Type: ${userData.property.type}</li>
        <li>Bedrooms: ${userData.property.bedrooms}</li>
        <li>Bathrooms: ${userData.property.bathrooms}</li>
        <li>Location: ${userData.property.location}</li>
      </ul>
      <h3>Contact Information:</h3>
      <ul>
        <li>Name: ${userData.contact.name}</li>
        <li>Email: ${userData.contact.email}</li>
        <li>Phone: ${userData.contact.phone}</li>
      </ul>
      <p><a href="/admin/applications">View in Admin Panel</a></p>
    `
  });
}
```

## Security Considerations

1. **Input Validation**: Always validate and sanitize user input
2. **Rate Limiting**: Implement rate limiting to prevent spam
3. **CSRF Protection**: Use CSRF tokens for form submissions
4. **HTTPS**: Ensure all API calls use HTTPS
5. **Data Encryption**: Encrypt sensitive data in transit and at rest

## Testing

Test your API endpoint with tools like:
- Postman
- cURL
- Browser Developer Tools
- Automated testing frameworks

## Deployment

1. Deploy your backend API to your hosting provider
2. Update the frontend JavaScript to use your actual API endpoint
3. Test the complete flow from form submission to data storage
4. Monitor for errors and performance issues

## Next Steps

Once your backend is set up:
1. Uncomment the fetch code in `script.js`
2. Update the API endpoint URL to match your domain
3. Test the complete user flow
4. Set up monitoring and analytics
5. Implement admin panel for managing applications

## Environment Configuration

### Environment Variables
Create a `.env` file for your backend:

```bash
# Database Configuration
DB_URI=mongodb://localhost:27017/metrohost
# or for production: mongodb+srv://username:password@cluster.mongodb.net/metrohost

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# API Configuration
API_PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# Security
JWT_SECRET=your-super-secret-jwt-key
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Docker Configuration
Create a `docker-compose.yml` for local development:

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DB_URI=mongodb://mongo:27017/metrohost
    depends_on:
      - mongo
    volumes:
      - .:/app
      - /app/node_modules

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## Advanced Features

### Application Status Tracking
Implement status updates for applications:

```javascript
app.put('/api/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      id,
      { 
        status,
        notes,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    // Notify user of status change
    await sendStatusUpdateEmail(application.contact.email, status);
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating status'
    });
  }
});
```

### File Upload Support
Add support for property photos and documents:

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload-files', upload.array('files', 5), async (req, res) => {
  try {
    const files = req.files;
    const uploadedUrls = [];
    
    for (const file of files) {
      // Upload to cloud storage (AWS S3, Google Cloud, etc.)
      const url = await uploadToCloudStorage(file);
      uploadedUrls.push(url);
    }
    
    res.json({
      success: true,
      urls: uploadedUrls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading files'
    });
  }
});
```

## Monitoring and Analytics

### Application Metrics
Track key performance indicators:

```javascript
// Middleware to log API requests
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    // Log to monitoring service (e.g., DataDog, New Relic)
    logMetrics({
      endpoint: req.path,
      method: req.method,
      statusCode: res.statusCode,
      duration,
      timestamp: new Date()
    });
  });
  
  next();
});
```

### Health Check Endpoint
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'connected' // Add actual DB health check
  });
});
```

## Production Deployment

### PM2 Configuration
Create `ecosystem.config.js` for production:

```javascript
module.exports = {
  apps: [{
    name: 'metrohost-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your CORS configuration matches your frontend domain
2. **Database Connection**: Check connection strings and network access
3. **Email Delivery**: Verify SMTP credentials and firewall settings
4. **Rate Limiting**: Adjust limits based on your traffic patterns

### Debug Mode
Enable debug logging in development:

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use(express.static('public'));
}
```

## Support and Resources

- **Documentation**: Keep this guide updated as you implement features
- **Testing**: Use tools like Jest, Mocha, or Postman for API testing
- **Monitoring**: Set up alerts for errors and performance issues
- **Backup**: Implement regular database backups and disaster recovery

---

*This guide covers the essential backend setup for MetroHost Collective. Customize the implementation based on your specific hosting environment and requirements.* 