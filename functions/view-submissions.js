const { getSubmissionStats, getRecentSubmissions } = require('./db-utils');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed'
      })
    };
  }

  try {
    // Get query parameters
    const { limit = 10, type } = event.queryStringParameters || {};
    
    // Get submission statistics
    const stats = await getSubmissionStats();
    
    // Get recent submissions
    const submissions = await getRecentSubmissions(parseInt(limit));
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          statistics: stats,
          submissions: submissions,
          timestamp: new Date().toISOString()
        }
      })
    };
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: `Error retrieving submissions: ${error.message}`
      })
    };
  }
};
