/**
 * Validator module for staff data validation
 */

// Valid options for dropdown fields
const VALID_OPTIONS = {
  title: ['Prof', 'Assoc. Prof', 'Dr', 'Mr', 'Mrs', 'Ms'],
  faculty: [
    'Faculty of Arts',
    'Faculty of Science',
    'Faculty of Engineering',
    'Faculty of Law',
    'Faculty of Social Sciences',
    'Faculty of Education',
    'Faculty of Environmental Sciences',
    'Faculty of Basic Medical Sciences',
    'Faculty of Clinical Sciences',
    'Faculty of Pharmacy',
    'Faculty of Dental Sciences',
    'College of Medicine',
    'Faculty of Management Sciences'
    // Add more faculties as needed
  ],
  rank: [
    'Professor',
    'Associate Professor',
    'Senior Lecturer',
    'Lecturer I',
    'Lecturer II',
    'Assistant Lecturer',
    'Research Fellow',
    'Senior Research Fellow',
    'Principal Research Fellow'
  ],
  employmentStatus: [
    'Full Time',
    'Contract',
    'Adjunct',
    'Part Time',
    'Visiting'
  ]
};

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate that value is not empty
 * @param {*} value - Value to check
 * @returns {boolean} True if not empty
 */
function isNotEmpty(value) {
  if (value === null || value === undefined) {
    return false;
  }
  
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  
  return true;
}

/**
 * Validate dropdown value against allowed options
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field (title, faculty, rank, employmentStatus)
 * @returns {Object} { valid: boolean, suggestion: string|null }
 */
function validateDropdownValue(value, fieldName) {
  if (!value || typeof value !== 'string') {
    return { valid: false, suggestion: null };
  }

  const validOptions = VALID_OPTIONS[fieldName] || [];
  const trimmedValue = value.trim();

  // Exact match (case-insensitive)
  const exactMatch = validOptions.find(
    option => option.toLowerCase() === trimmedValue.toLowerCase()
  );

  if (exactMatch) {
    return { valid: true, suggestion: exactMatch };
  }

  // Try to find a close match
  const closeMatch = validOptions.find(
    option => option.toLowerCase().includes(trimmedValue.toLowerCase()) ||
              trimmedValue.toLowerCase().includes(option.toLowerCase())
  );

  if (closeMatch) {
    return { valid: false, suggestion: closeMatch };
  }

  return { valid: false, suggestion: null };
}

/**
 * Validate a single staff record
 * @param {Object} staffRecord - Staff record to validate
 * @param {Object} options - Validation options
 * @returns {Object} { valid: boolean, errors: Array, warnings: Array }
 */
function validateStaffRecord(staffRecord, options = {}) {
  const errors = [];
  const warnings = [];
  const strictMode = options.strictMode !== false; // Default to true

  // Required fields
  const requiredFields = ['title', 'surname', 'firstName', 'email', 'faculty', 'department', 'rank', 'employmentStatus'];

  // Check required fields
  for (const field of requiredFields) {
    if (!isNotEmpty(staffRecord[field])) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate email
  if (staffRecord.email && !isValidEmail(staffRecord.email)) {
    errors.push(`Invalid email format: ${staffRecord.email}`);
  }

  // Validate email domain (optional check for UNILAG)
  if (staffRecord.email && options.checkEmailDomain) {
    const emailDomain = staffRecord.email.split('@')[1];
    if (emailDomain && !emailDomain.toLowerCase().includes('unilag.edu.ng')) {
      warnings.push(`Email domain "${emailDomain}" may not be a UNILAG email`);
    }
  }

  // Validate dropdown fields
  const dropdownFields = ['title', 'rank', 'employmentStatus'];
  
  for (const field of dropdownFields) {
    if (staffRecord[field]) {
      const validation = validateDropdownValue(staffRecord[field], field);
      
      if (!validation.valid) {
        if (validation.suggestion) {
          if (strictMode) {
            errors.push(`Invalid ${field}: "${staffRecord[field]}". Did you mean "${validation.suggestion}"?`);
          } else {
            warnings.push(`${field} value "${staffRecord[field]}" may be incorrect. Suggestion: "${validation.suggestion}"`);
          }
        } else {
          if (strictMode) {
            errors.push(`Invalid ${field}: "${staffRecord[field]}". Must be one of: ${VALID_OPTIONS[field].join(', ')}`);
          } else {
            warnings.push(`${field} value "${staffRecord[field]}" is not in the standard list`);
          }
        }
      }
    }
  }

  // Validate name fields (should not contain numbers)
  const nameFields = ['surname', 'firstName', 'middleName'];
  for (const field of nameFields) {
    if (staffRecord[field] && /\d/.test(staffRecord[field])) {
      warnings.push(`${field} contains numbers: "${staffRecord[field]}"`);
    }
  }

  // Check for suspicious data
  if (staffRecord.firstName && staffRecord.firstName.length < 2) {
    warnings.push(`First name seems too short: "${staffRecord.firstName}"`);
  }
  
  if (staffRecord.surname && staffRecord.surname.length < 2) {
    warnings.push(`Surname seems too short: "${staffRecord.surname}"`);
  }

  return {
    valid: errors.length === 0,
    errors: errors,
    warnings: warnings
  };
}

/**
 * Validate multiple staff records
 * @param {Array} staffRecords - Array of staff records
 * @param {Object} options - Validation options
 * @returns {Object} { valid: boolean, results: Array, summary: Object }
 */
function validateStaffRecords(staffRecords, options = {}) {
  const results = [];
  let totalValid = 0;
  let totalInvalid = 0;
  let totalWarnings = 0;

  for (let i = 0; i < staffRecords.length; i++) {
    const record = staffRecords[i];
    const validation = validateStaffRecord(record, options);
    
    results.push({
      recordNumber: i + 1,
      record: record,
      ...validation
    });

    if (validation.valid) {
      totalValid++;
    } else {
      totalInvalid++;
    }

    totalWarnings += validation.warnings.length;
  }

  return {
    valid: totalInvalid === 0,
    results: results,
    summary: {
      total: staffRecords.length,
      valid: totalValid,
      invalid: totalInvalid,
      warnings: totalWarnings
    }
  };
}

/**
 * Sanitize staff record by trimming whitespace and normalizing values
 * @param {Object} staffRecord - Staff record to sanitize
 * @returns {Object} Sanitized staff record
 */
function sanitizeStaffRecord(staffRecord) {
  const sanitized = {};

  for (const [key, value] of Object.entries(staffRecord)) {
    if (typeof value === 'string') {
      // Trim whitespace
      let cleaned = value.trim();
      
      // Remove extra spaces
      cleaned = cleaned.replace(/\s+/g, ' ');
      
      // For dropdown fields, try to match with valid options
      if (['title', 'rank', 'employmentStatus'].includes(key)) {
        const validation = validateDropdownValue(cleaned, key);
        if (validation.valid || validation.suggestion) {
          cleaned = validation.suggestion || cleaned;
        }
      }
      
      sanitized[key] = cleaned;
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Get valid options for a field
 * @param {string} fieldName - Name of the field
 * @returns {Array} Array of valid options
 */
function getValidOptions(fieldName) {
  return VALID_OPTIONS[fieldName] || [];
}

/**
 * Add custom valid option to a field
 * @param {string} fieldName - Name of the field
 * @param {string} option - Option to add
 */
function addValidOption(fieldName, option) {
  if (!VALID_OPTIONS[fieldName]) {
    VALID_OPTIONS[fieldName] = [];
  }
  
  if (!VALID_OPTIONS[fieldName].includes(option)) {
    VALID_OPTIONS[fieldName].push(option);
  }
}

module.exports = {
  validateStaffRecord,
  validateStaffRecords,
  sanitizeStaffRecord,
  isValidEmail,
  isNotEmpty,
  validateDropdownValue,
  getValidOptions,
  addValidOption,
  VALID_OPTIONS
};
