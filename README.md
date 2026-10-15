# Google Form AutoFiller for Nigerian University Staff

An automated system for filling Google Forms with Nigerian university staff information from CSV, Excel, or DOCX files.

## 🎯 Overview

This tool automates the process of submitting staff information to Google Forms, specifically designed for Nigerian universities (like UNILAG) that need to collect academic staff data including:

- Title (Prof, Assoc. Prof, Dr, Mr, Mrs, Ms)
- Full Name (Surname, First Name, Middle Name)
- Email Address
- Faculty
- Department
- Academic Rank
- Employment Status

## ✨ Features

- **Multiple File Formats**: Supports CSV, Excel (.xlsx, .xls), and DOCX files
- **Data Validation**: Validates data before submission with detailed error reporting
- **Smart Parsing**: Handles different column name variations automatically
- **Batch Processing**: Process multiple staff records automatically
- **Error Recovery**: Takes screenshots on errors and continues with remaining records
- **Progress Tracking**: Real-time progress updates with colored console output
- **Flexible Configuration**: Easy configuration for different Google Forms

## 📋 Requirements

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Internet connection for form submission

## 🚀 Installation

1. **Clone or download this repository**

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install:
   - `puppeteer` - Browser automation
   - `csv-parser` - CSV file parsing
   - `xlsx` - Excel file parsing
   - `mammoth` - DOCX file parsing
   - `commander` - CLI interface
   - `chalk` - Colored console output
   - `ora` - Progress spinners

## ⚙️ Configuration

### Step 1: Create Your Google Form

Create a Google Form with the following fields:
- Title (Dropdown)
- Surname (Text)
- First Name (Text)
- Middle Name (Text, optional)
- Email Address (Email)
- Faculty (Dropdown)
- Department (Text or Dropdown)
- Rank (Dropdown)
- Employment Status (Dropdown)

### Step 2: Configure the Tool

1. **Copy the example configuration**:
   ```bash
   cp config.example.json config.json
   ```

2. **Update `config.json`** with your form details:
   - Replace `YOUR_FORM_ID` with your actual Google Form ID
   - Update field selectors to match your form structure

3. **Finding Field Selectors**:
   - Open your Google Form in a browser
   - Right-click on a field → "Inspect" or "Inspect Element"
   - Find the appropriate selector (look for `aria-label`, `data-params`, etc.)
   - Update the selector in `config.json`

**Example config.json**:
```json
{
  "formUrl": "https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform",
  "fieldMappings": {
    "title": {
      "selector": "div[aria-label*='Title'] div[role='listbox']",
      "type": "dropdown",
      "required": true
    },
    "email": {
      "selector": "input[type='email']",
      "type": "email",
      "required": true
    }
    // ... other fields
  }
}
```

## 📊 Preparing Your Data File

### Required Columns

Your data file must include these columns (column names are case-insensitive):

- **Title**: Prof, Assoc. Prof, Dr, Mr, Mrs, Ms
- **Surname** (or Last Name)
- **FirstName** (or First Name)
- **MiddleName** (or Middle Name) - Optional
- **Email** (or Email Address)
- **Faculty**
- **Department** (or Dept)
- **Rank** (or Position)
- **EmploymentStatus** (or Employment Status, Status)

### Supported File Formats

#### CSV Format
```csv
Title,Surname,FirstName,MiddleName,Email,Faculty,Department,Rank,EmploymentStatus
Prof,Adeyemi,Oluwaseun,Babatunde,o.adeyemi@unilag.edu.ng,Faculty of Science,Computer Science,Professor,Full Time
Dr,Okonkwo,Chioma,Ngozi,c.okonkwo@unilag.edu.ng,Faculty of Engineering,Electrical Engineering,Senior Lecturer,Full Time
```

#### Excel Format (.xlsx, .xls)
Create a spreadsheet with columns matching the required fields above.

#### DOCX Format
Create a Word document with a tab-separated table:
- First row: Column headers
- Subsequent rows: Data (use Tab key to separate columns)

## 🎮 Usage

### Command 1: Validate Data (Recommended First Step)

Check your data file for errors before submitting:

```bash
node src/index.js validate -f data/staff.csv
```

**Options**:
- `-f, --file <path>`: Path to your data file (required)
- `--strict`: Use strict validation mode

**Example**:
```bash
node src/index.js validate -f data/staff.xlsx --strict
```

### Command 2: Fill Form

Process and submit data to Google Form:

```bash
node src/index.js fill -f data/staff.csv -c config.json
```

**Options**:
- `-f, --file <path>`: Path to your data file (required)
- `-c, --config <path>`: Path to config file (required)
- `-h, --headless`: Run browser in headless mode (default: true)
- `-d, --delay <ms>`: Delay between submissions in milliseconds (default: 2000)
- `--no-validate`: Skip data validation
- `--strict`: Use strict validation mode

**Examples**:

```bash
# Basic usage with default settings
node src/index.js fill -f data/staff.csv -c config.json

# Run with visible browser (for debugging)
node src/index.js fill -f data/staff.xlsx -c config.json --no-headless

# Increase delay between submissions to 5 seconds
node src/index.js fill -f data/staff.csv -c config.json -d 5000

# Skip validation (not recommended)
node src/index.js fill -f data/staff.csv -c config.json --no-validate
```

### Command 3: Create Config

Generate a sample configuration file:

```bash
node src/index.js create-config -o my-config.json
```

## 📝 Data Validation

The tool validates:
- ✅ Required fields are present
- ✅ Email format is correct
- ✅ Dropdown values match expected options
- ✅ Names don't contain numbers
- ✅ Field lengths are reasonable

**Validation Results**:
- **Valid**: Record passes all checks
- **Invalid**: Record has errors and will be skipped
- **Warnings**: Record has potential issues but will be processed

## 🔍 Valid Options

### Titles
- Prof
- Assoc. Prof
- Dr
- Mr
- Mrs
- Ms

### Ranks
- Professor
- Associate Professor
- Senior Lecturer
- Lecturer I
- Lecturer II
- Assistant Lecturer
- Research Fellow
- Senior Research Fellow
- Principal Research Fellow

### Employment Status
- Full Time
- Contract
- Adjunct
- Part Time
- Visiting

### Faculties (Examples for UNILAG)
- Faculty of Arts
- Faculty of Science
- Faculty of Engineering
- Faculty of Law
- Faculty of Social Sciences
- Faculty of Education
- Faculty of Environmental Sciences
- Faculty of Basic Medical Sciences
- Faculty of Clinical Sciences
- Faculty of Pharmacy
- Faculty of Dental Sciences
- College of Medicine
- Faculty of Management Sciences

*Note: You can customize these in `src/validator.js`*

## 📂 Project Structure

```
AUTO-FILLER-NIGERIAN-INSTITUTIONS/
├── src/
│   ├── index.js          # Main CLI application
│   ├── fileParser.js     # File parsing logic
│   ├── formFiller.js     # Form automation logic
│   └── validator.js      # Data validation logic
├── data/                 # Place your data files here
├── logs/                 # Error logs and screenshots
├── config.json           # Your form configuration
├── config.example.json   # Example configuration
├── package.json          # Dependencies
└── README.md            # This file
```

## 🐛 Troubleshooting

### Issue: "Configuration file not found"
**Solution**: Make sure you've created `config.json` from the example file.

### Issue: "Failed to find selector"
**Solution**: 
1. Open your form in a browser
2. Inspect the field elements
3. Update the selectors in `config.json`
4. Test with `--no-headless` flag to see what's happening

### Issue: "Invalid dropdown value"
**Solution**: 
1. Check that your data exactly matches the form options
2. Run validation first: `node src/index.js validate -f yourfile.csv`
3. Update `src/validator.js` with your specific valid options

### Issue: Form not submitting
**Solution**:
1. Ensure your form allows multiple submissions
2. Check if the form requires sign-in
3. Verify the form URL is correct
4. Test with a small data file first

### Issue: Browser crashes or hangs
**Solution**:
1. Increase delay: `-d 5000`
2. Process records in smaller batches
3. Check your internet connection

## 📊 Output and Logs

### Console Output
The tool provides real-time feedback:
- ✓ Green: Successful operations
- ✗ Red: Errors
- ⚠ Yellow: Warnings
- ℹ Blue: Information

### Error Logs
Failed submissions are saved to `logs/error-log-[timestamp].json`

### Screenshots
Error screenshots are saved to `logs/error-record-[number]-[timestamp].png`

## 🔒 Security Notes

- Keep your `config.json` secure (don't commit with real form URLs)
- Validate data before submission
- Use university email addresses
- Test with sample data first
- Monitor submissions for accuracy

## 🤝 Best Practices

1. **Always validate first**: Run `validate` command before `fill`
2. **Start small**: Test with 2-3 records first
3. **Use --no-headless for debugging**: See what's happening in real-time
4. **Backup your data**: Keep original files safe
5. **Monitor progress**: Watch the console output
6. **Check form submissions**: Verify submissions in Google Forms responses

## 💡 Tips

- Column names are case-insensitive
- Middle name is optional
- The tool handles various column name formats (e.g., "First Name", "FirstName", "first name")
- Invalid records are automatically skipped
- You can interrupt the process at any time (Ctrl+C)

## 🆘 Support

If you encounter issues:
1. Check the error logs in `logs/` directory
2. Review error screenshots
3. Validate your data file first
4. Verify configuration file selectors
5. Test with `--no-headless` flag to see browser behavior

## 📄 License

MIT License - feel free to use and modify for your institution's needs.

## 🔄 Version

Version 1.0.0

---

**Made for Nigerian Universities** 🇳🇬
