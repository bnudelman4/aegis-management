const { neon } = require('@netlify/neon');

// Initialize database connection
const sql = neon();

// Database schema setup
const setupDatabase = async () => {
  try {
    // Create contact form submissions table
    await sql`
      CREATE TABLE IF NOT EXISTS contact_form_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        service VARCHAR(100),
        message TEXT NOT NULL,
        submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT
      )
    `;

    // Create qualification form submissions table
    await sql`
      CREATE TABLE IF NOT EXISTS qualification_form_submissions (
        id SERIAL PRIMARY KEY,
        application_id VARCHAR(100) UNIQUE NOT NULL,
        
        -- Contact Information
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        preferred_contact VARCHAR(50),
        best_time VARCHAR(100),
        
        -- Property Details
        city_zip VARCHAR(100),
        space_type VARCHAR(100),
        live_at_property VARCHAR(10),
        rental_type VARCHAR(100),
        guest_capacity VARCHAR(50),
        furnished VARCHAR(10),
        furniture_details TEXT,
        open_to_furnishing VARCHAR(10),
        bathroom_situation VARCHAR(100),
        private_entrance VARCHAR(10),
        approximate_size VARCHAR(100),
        ready_for_photography VARCHAR(10),
        pets_allowed VARCHAR(10),
        restrictions TEXT,
        
        -- Goals & Timeline
        hosting_timeline VARCHAR(100),
        priority VARCHAR(100),
        involvement_level VARCHAR(100),
        
        -- Metadata
        submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        consent_given BOOLEAN DEFAULT FALSE
      )
    `;

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
};

// Save contact form submission
const saveContactForm = async (formData, metadata = {}) => {
  try {
    const result = await sql`
      INSERT INTO contact_form_submissions (
        name, email, phone, service, message, ip_address, user_agent
      ) VALUES (
        ${formData.name}, 
        ${formData.email}, 
        ${formData.phone || null}, 
        ${formData.service || null}, 
        ${formData.message},
        ${metadata.ipAddress || null},
        ${metadata.userAgent || null}
      ) RETURNING id
    `;
    
    return result[0];
  } catch (error) {
    console.error('Error saving contact form to database:', error);
    throw error;
  }
};

// Save qualification form submission
const saveQualificationForm = async (formData, metadata = {}) => {
  try {
    const result = await sql`
      INSERT INTO qualification_form_submissions (
        application_id,
        full_name, email, phone, preferred_contact, best_time,
        city_zip, space_type, live_at_property, rental_type, guest_capacity,
        furnished, furniture_details, open_to_furnishing, bathroom_situation,
        private_entrance, approximate_size, ready_for_photography, pets_allowed, restrictions,
        hosting_timeline, priority, involvement_level,
        ip_address, user_agent, consent_given
      ) VALUES (
        ${formData.applicationId || `app_${Date.now()}`},
        ${formData.contact.name}, ${formData.contact.email}, ${formData.contact.phone || null},
        ${formData.contact.preferredContact || null}, ${formData.contact.bestTime || null},
        ${formData.property?.cityZip || null}, ${formData.property?.spaceType || null},
        ${formData.property?.liveAtProperty || null}, ${formData.property?.rentalType || null},
        ${formData.property?.guestCapacity || null}, ${formData.property?.furnished || null},
        ${formData.property?.furnitureDetails || null}, ${formData.property?.openToFurnishing || null},
        ${formData.property?.bathroomSituation || null}, ${formData.property?.privateEntrance || null},
        ${formData.property?.approximateSize || null}, ${formData.property?.readyForPhotography || null},
        ${formData.property?.petsAllowed || null}, ${formData.property?.restrictions || null},
        ${formData.goals?.hostingTimeline || null}, ${formData.goals?.priority || null},
        ${formData.goals?.involvementLevel || null},
        ${metadata.ipAddress || null}, ${metadata.userAgent || null}, true
      ) RETURNING id, application_id
    `;
    
    return result[0];
  } catch (error) {
    console.error('Error saving qualification form to database:', error);
    throw error;
  }
};

// Get form submission statistics
const getSubmissionStats = async () => {
  try {
    const contactCount = await sql`SELECT COUNT(*) as count FROM contact_form_submissions`;
    const qualificationCount = await sql`SELECT COUNT(*) as count FROM qualification_form_submissions`;
    
    return {
      contactForms: parseInt(contactCount[0].count),
      qualificationForms: parseInt(qualificationCount[0].count),
      total: parseInt(contactCount[0].count) + parseInt(qualificationCount[0].count)
    };
  } catch (error) {
    console.error('Error getting submission stats:', error);
    throw error;
  }
};

// Get recent submissions
const getRecentSubmissions = async (limit = 10) => {
  try {
    const contactSubmissions = await sql`
      SELECT id, name, email, submission_date, service 
      FROM contact_form_submissions 
      ORDER BY submission_date DESC 
      LIMIT ${limit}
    `;
    
    const qualificationSubmissions = await sql`
      SELECT id, application_id, full_name, email, submission_date, space_type 
      FROM qualification_form_submissions 
      ORDER BY submission_date DESC 
      LIMIT ${limit}
    `;
    
    return {
      contact: contactSubmissions,
      qualification: qualificationSubmissions
    };
  } catch (error) {
    console.error('Error getting recent submissions:', error);
    throw error;
  }
};

module.exports = {
  setupDatabase,
  saveContactForm,
  saveQualificationForm,
  getSubmissionStats,
  getRecentSubmissions
};
