const nodemailer = require('nodemailer');
const { saveQualificationForm } = require('./db-utils');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    const userData = JSON.parse(event.body);
    
    // Validate required fields
    if (!userData.contact || !userData.contact.email || !userData.contact.name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Email and name are required'
        })
      };
    }

    // Create email transporter (using Gmail as example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail app password
      }
    });

    // Email to your team
    const teamEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.TEAM_EMAIL || process.env.EMAIL_USER, // Your team email
      subject: 'New Property Application - Aegis Management',
      html: `
        <h2>New Property Application Received</h2>
        <h3>Contact Information:</h3>
        <ul>
          <li><strong>Name:</strong> ${userData.contact.name}</li>
          <li><strong>Email:</strong> ${userData.contact.email}</li>
          <li><strong>Phone:</strong> ${userData.contact.phone || 'Not provided'}</li>
        </ul>
        
        <h3>Property Details:</h3>
        <ul>
          <li><strong>City & Zip:</strong> ${userData.property?.cityZip || 'Not provided'}</li>
          <li><strong>Space Type:</strong> ${userData.property?.spaceType || 'Not provided'}</li>
          <li><strong>Rental Type:</strong> ${userData.property?.rentalType || 'Not provided'}</li>
          <li><strong>Guest Capacity:</strong> ${userData.property?.guestCapacity || 'Not provided'}</li>
          <li><strong>Size (sq ft):</strong> ${userData.property?.approximateSize || 'Not provided'}</li>
          <li><strong>Furnished:</strong> ${userData.property?.furnished || 'Not provided'}</li>
          <li><strong>Private Entrance:</strong> ${userData.property?.privateEntrance || 'Not provided'}</li>
        </ul>
        
        <h3>Goals & Timeline:</h3>
        <ul>
          <li><strong>Hosting Timeline:</strong> ${userData.goals?.hostingTimeline || 'Not provided'}</li>
          <li><strong>Priority:</strong> ${userData.goals?.priority || 'Not provided'}</li>
          <li><strong>Involvement Level:</strong> ${userData.goals?.involvementLevel || 'Not provided'}</li>
        </ul>
        
        <h3>Additional Information:</h3>
        <ul>
          <li><strong>Live at Property:</strong> ${userData.property?.liveAtProperty || 'Not provided'}</li>
          <li><strong>Bathroom Situation:</strong> ${userData.property?.bathroomSituation || 'Not provided'}</li>
          <li><strong>Ready for Photography:</strong> ${userData.property?.readyForPhotography || 'Not provided'}</li>
          <li><strong>Pets Allowed:</strong> ${userData.property?.petsAllowed || 'Not provided'}</li>
          <li><strong>Restrictions:</strong> ${userData.property?.restrictions || 'None mentioned'}</li>
        </ul>
        
        <h3>Contact Preferences:</h3>
        <ul>
          <li><strong>Preferred Contact:</strong> ${userData.contact?.preferredContact || 'Not provided'}</li>
          <li><strong>Best Time:</strong> ${userData.contact?.bestTime || 'Not provided'}</li>
        </ul>
        
        <p><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    // Send email to team
    await transporter.sendMail(teamEmail);

    // Send confirmation email to user
    const confirmationEmail = {
      from: process.env.EMAIL_USER,
      to: userData.contact.email,
      subject: 'Application Received - MetroHost Collective',
      html: `
        <h2>Thank you for your application, ${userData.contact.name}!</h2>
        <p>We've received your property management application and will review it within 24 hours.</p>
        <p>Our team will reach out to you at your preferred contact method (${userData.contact.preferredContact || 'email'}) with a free income projection and next steps.</p>
        <br>
        <p>Best regards,<br>The MetroHost Collective Team</p>
        <p><strong>Phone:</strong> +1 (555) 123-4567<br>
        <strong>Email:</strong> hello@metrohostcollective.com</p>
      `
    };

    await transporter.sendMail(confirmationEmail);

    // Save to database
    const metadata = {
      ipAddress: event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown',
      userAgent: event.headers['user-agent'] || 'unknown'
    };
    
    let dbResult;
    try {
      dbResult = await saveQualificationForm(userData, metadata);
      console.log('Qualification form saved to database successfully');
    } catch (dbError) {
      console.error('Error saving to database:', dbError);
      // Don't fail the entire request if database save fails
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Application submitted successfully',
        applicationId: dbResult?.application_id || `app_${Date.now()}`
      })
    };

  } catch (error) {
    console.error('Error submitting application:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: `Internal server error: ${error.message}`
      })
    };
  }
}; 