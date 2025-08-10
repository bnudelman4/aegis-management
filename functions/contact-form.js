const nodemailer = require('nodemailer');

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
    console.log('Contact form function called');
    console.log('Event body:', event.body);
    
    const formData = JSON.parse(event.body);
    console.log('Parsed form data:', formData);
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Name, email, and message are required'
        })
      };
    }

    console.log('Creating email transporter...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
    
    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email to your team
    const teamEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.TEAM_EMAIL || process.env.EMAIL_USER,
      subject: 'New Contact Form Submission - MetroHost Collective',
      html: `
        <h2>New Contact Form Submission</h2>
        <h3>Contact Information:</h3>
        <ul>
          <li><strong>Name:</strong> ${formData.name}</li>
          <li><strong>Email:</strong> ${formData.email}</li>
          <li><strong>Phone:</strong> ${formData.phone || 'Not provided'}</li>
        </ul>
        
        <h3>Service Interest:</h3>
        <p><strong>Selected Service:</strong> ${formData.service || 'Not specified'}</p>
        
        <h3>Message:</h3>
        <p>${formData.message}</p>
        
        <p><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
        
        <hr>
        <p><em>This message was sent from the MetroHost Collective contact form.</em></p>
      `
    };

    // Send email to team
    await transporter.sendMail(teamEmail);

    // Send confirmation email to user
    const confirmationEmail = {
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: 'Thank you for contacting MetroHost Collective',
      html: `
        <h2>Thank you for reaching out, ${formData.name}!</h2>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p>If you have any urgent questions, feel free to call us at +1 (555) 123-4567.</p>
        <br>
        <p>Best regards,<br>The MetroHost Collective Team</p>
        <p><strong>Phone:</strong> +1 (555) 123-4567<br>
        <strong>Email:</strong> hello@metrohostcollective.com<br>
        <strong>Hours:</strong> Monday - Friday: 9AM - 6PM EST</p>
      `
    };

    await transporter.sendMail(confirmationEmail);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Message sent successfully'
      })
    };

  } catch (error) {
    console.error('Error sending contact form:', error);
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