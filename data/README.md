# Sample Data Files

This directory contains sample data files for testing the Google Form AutoFiller.

## Available Sample Files

### 1. sample-staff.csv
A full sample with 10 staff records in CSV format. Use this for comprehensive testing.

### 2. sample-staff-small.csv
A smaller sample with 3 staff records. Perfect for initial testing and debugging.

## Creating Your Own Data Files

### CSV Format

Create a CSV file with the following columns (order doesn't matter):

```csv
Title,Surname,FirstName,MiddleName,Email,Faculty,Department,Rank,EmploymentStatus
Prof,Adeyemi,Oluwaseun,Babatunde,o.adeyemi@unilag.edu.ng,Faculty of Science,Computer Science,Professor,Full Time
```

**Tips**:
- Use any spreadsheet software (Excel, Google Sheets) and export as CSV
- Column names are case-insensitive
- Middle name is optional (can be left empty)

### Excel Format (.xlsx or .xls)

1. Open Excel or Google Sheets
2. Create a table with these column headers in the first row:
   - Title
   - Surname
   - FirstName
   - MiddleName
   - Email
   - Faculty
   - Department
   - Rank
   - EmploymentStatus

3. Fill in your data in the rows below
4. Save as .xlsx or .xls format

**To create sample-staff.xlsx from the CSV**:
1. Open `sample-staff.csv` in Excel
2. Save As → Excel Workbook (.xlsx)
3. Done!

### DOCX Format

1. Open Microsoft Word
2. Insert a table (9 columns)
3. First row: Column headers (same as above)
4. Following rows: Your data
5. **Important**: Use TAB key to separate columns, not spaces
6. Save as .docx

**Alternative method**:
1. Create your data in Excel
2. Copy the entire table
3. Paste into Word
4. Save as .docx

## Field Requirements

### Required Fields
- Title
- Surname
- FirstName
- Email
- Faculty
- Department
- Rank
- EmploymentStatus

### Optional Fields
- MiddleName

## Valid Values

### Title
- Prof
- Assoc. Prof
- Dr
- Mr
- Mrs
- Ms

### Rank
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

### Faculty (UNILAG Examples)
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

### Email Format
Should follow the pattern: `name@unilag.edu.ng` or your institution's domain

## Testing Your Data

Before submitting to the form, validate your data:

```bash
node src/index.js validate -f data/your-file.csv
```

This will check for:
- Missing required fields
- Invalid email formats
- Incorrect dropdown values
- Other data quality issues

## Sample Data Details

The sample files contain fictional staff members with:
- Diverse Nigerian names from various ethnic groups
- Different academic ranks and titles
- Multiple faculties and departments
- Various employment statuses
- Properly formatted UNILAG email addresses

**Note**: All data in sample files is fictional and for testing purposes only.
