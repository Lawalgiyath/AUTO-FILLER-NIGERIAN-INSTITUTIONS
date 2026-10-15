const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const mammoth = require('mammoth');

/**
 * Parse CSV file and extract staff records
 * @param {string} filePath - Path to CSV file
 * @returns {Promise<Array>} Array of staff objects
 */
async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Normalize the keys to handle different casing
        const normalizedData = normalizeKeys(data);
        results.push(normalizedData);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Parse Excel file (XLS/XLSX) and extract staff records
 * @param {string} filePath - Path to Excel file
 * @returns {Promise<Array>} Array of staff objects
 */
async function parseExcel(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Use first sheet
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Normalize keys for each record
    const normalizedData = jsonData.map(row => normalizeKeys(row));
    
    return normalizedData;
  } catch (error) {
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
}

/**
 * Parse DOCX file and extract staff records
 * Expects a table format in the Word document
 * @param {string} filePath - Path to DOCX file
 * @returns {Promise<Array>} Array of staff objects
 */
async function parseDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;
    
    // Split by lines and process
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('DOCX file must contain headers and at least one data row');
    }
    
    // First line should be headers
    const headers = lines[0].split('\t').map(h => h.trim());
    
    // Process remaining lines as data
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('\t').map(v => v.trim());
      
      if (values.length === headers.length) {
        const record = {};
        headers.forEach((header, index) => {
          record[header] = values[index];
        });
        records.push(normalizeKeys(record));
      }
    }
    
    return records;
  } catch (error) {
    throw new Error(`Failed to parse DOCX file: ${error.message}`);
  }
}

/**
 * Normalize object keys to standard format (lowercase, no spaces)
 * @param {Object} obj - Object with potentially varied key formats
 * @returns {Object} Object with normalized keys
 */
function normalizeKeys(obj) {
  const keyMapping = {
    'title': ['title', 'Title', 'TITLE'],
    'surname': ['surname', 'Surname', 'SURNAME', 'last name', 'Last Name', 'lastname', 'LastName'],
    'firstName': ['firstname', 'FirstName', 'first name', 'First Name', 'FIRSTNAME', 'FIRST NAME'],
    'middleName': ['middlename', 'MiddleName', 'middle name', 'Middle Name', 'MIDDLENAME', 'MIDDLE NAME'],
    'email': ['email', 'Email', 'EMAIL', 'email address', 'Email Address', 'EMAIL ADDRESS'],
    'faculty': ['faculty', 'Faculty', 'FACULTY'],
    'department': ['department', 'Department', 'DEPARTMENT', 'dept', 'Dept', 'DEPT'],
    'rank': ['rank', 'Rank', 'RANK', 'position', 'Position', 'POSITION'],
    'employmentStatus': ['employmentstatus', 'EmploymentStatus', 'employment status', 'Employment Status', 
                         'EMPLOYMENT STATUS', 'status', 'Status', 'STATUS']
  };

  const normalized = {};

  // For each standard key, find matching key in input object
  for (const [standardKey, variants] of Object.entries(keyMapping)) {
    for (const variant of variants) {
      if (obj.hasOwnProperty(variant)) {
        normalized[standardKey] = obj[variant];
        break;
      }
    }
  }

  return normalized;
}

/**
 * Main parser function that auto-detects file type and parses accordingly
 * @param {string} filePath - Path to the file
 * @returns {Promise<Array>} Array of staff objects
 */
async function parseFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.csv':
      return await parseCSV(filePath);
    case '.xlsx':
    case '.xls':
      return await parseExcel(filePath);
    case '.docx':
      return await parseDOCX(filePath);
    default:
      throw new Error(`Unsupported file format: ${ext}. Supported formats: .csv, .xlsx, .xls, .docx`);
  }
}

module.exports = {
  parseFile,
  parseCSV,
  parseExcel,
  parseDOCX,
  normalizeKeys
};
