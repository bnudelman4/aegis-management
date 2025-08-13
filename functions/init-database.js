const { setupDatabase } = require('./db-utils');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod === 'POST') {
      // Initialize database tables
      await setupDatabase();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Database initialized successfully'
        })
      };
    } else if (event.httpMethod === 'GET') {
      // Return database status
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Database initialization endpoint',
          usage: 'Send POST request to initialize database tables'
        })
      };
    } else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Method not allowed'
        })
      };
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: `Database initialization failed: ${error.message}`
      })
    };
  }
};
