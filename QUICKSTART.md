# Quick Start Guide

Get started with the Google Form AutoFiller in 5 minutes!

## Step 1: Install Dependencies (2 minutes)

```bash
npm install
```

This installs all required packages including Puppeteer, which may take a minute or two.

## Step 2: Prepare Your Configuration (2 minutes)

### Option A: Use the example config
```bash
# Copy the example configuration
cp config.example.json config.json
```

Then edit `config.json`:
1. Replace `YOUR_FORM_ID` with your Google Form ID
2. Update field selectors if needed (see below)

### Option B: Generate a new config
```bash
node src/index.js create-config -o config.json
```

### Finding Your Form ID

Your Google Form URL looks like:
```
https://docs.google.com/forms/d/e/1FAIpQLSc...abc123.../viewform
```

The form ID is the long string after `/d/e/` and before `/viewform`

### Finding Field Selectors (if needed)

1. Open your Google Form in Chrome/Edge
2. Right-click on a field → "Inspect"
3. Look for attributes like `aria-label` or `data-params`
4. Update the selector in `config.json`

**Common selectors**:
- Text fields: `input[aria-label*='Field Name']`
- Dropdowns: `div[role='listbox']`
- Email: `input[type='email']`

## Step 3: Prepare Your Data (1 minute)

### Option A: Use sample data (for testing)
We've included sample files in the `data/` directory:
- `sample-staff-small.csv` - 3 records (recommended for first test)
- `sample-staff.csv` - 10 records

### Option B: Create your own

Create a CSV file with these columns:
```csv
Title,Surname,FirstName,MiddleName,Email,Faculty,Department,Rank,EmploymentStatus
Prof,Doe,John,Smith,j.doe@unilag.edu.ng,Faculty of Science,Computer Science,Professor,Full Time
```

Save it in the `data/` directory.

## Step 4: Validate Your Data (30 seconds)

Always validate before submitting:

```bash
node src/index.js validate -f data/sample-staff-small.csv
```

This checks for errors and shows you exactly what needs to be fixed.

## Step 5: Run the AutoFiller (Time depends on number of records)

### Test Run (Recommended First Time)
Start with a visible browser to see what's happening:

```bash
node src/index.js fill -f data/sample-staff-small.csv -c config.json --no-headless
```

This opens a browser window so you can watch the automation in action.

### Production Run
Once you've confirmed it works, run in headless mode:

```bash
node src/index.js fill -f data/your-data.csv -c config.json
```

## What to Expect

### During Validation
```
🔍 Data Validation

✓ Parsed 3 records
✓ Data sanitized
✓ Validating records...

📋 Validation Results:

  Total Records: 3
  ✓ Valid: 3
  ✗ Invalid: 0
  ⚠ Warnings: 0

✅ All records are valid!
```

### During Form Filling
```
🚀 Google Form AutoFiller

✓ Configuration loaded
✓ Parsed 3 records from file
✓ Data sanitized
✓ All records validated successfully
✓ Browser initialized
✓ Form loaded

📝 Processing 3 records...

✓ 1/3: Oluwaseun Adeyemi - Submitted successfully
✓ 2/3: Chioma Okonkwo - Submitted successfully
✓ 3/3: Yusuf Ibrahim - Submitted successfully

📊 Final Results:

  Total Records: 3
  ✓ Successful: 3
  ✗ Failed: 0

✅ Process completed!
```

## Common First-Time Issues

### Issue: "Configuration file not found"
**Solution**: Make sure you created `config.json` in the project root directory

### Issue: "Failed to navigate to form"
**Solution**: Check that your form URL is correct and the form is publicly accessible

### Issue: "Invalid dropdown value"
**Solution**: Your data doesn't match the form's dropdown options. Run validation to see which values are incorrect.

### Issue: Browser not starting
**Solution**: 
- Make sure Puppeteer installed correctly: `npm install puppeteer`
- Try running with `--no-headless` to see any error messages

## Tips for Success

1. **Start small**: Test with 2-3 records first
2. **Use validation**: Always run `validate` before `fill`
3. **Watch it work**: Use `--no-headless` the first few times
4. **Check form responses**: Verify submissions in Google Forms after completion
5. **Adjust delays**: If submissions fail, increase delay: `-d 5000` (5 seconds)

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [data/README.md](data/README.md) for data file format details
- Review `config.example.json` for all configuration options
- Test with your own data files

## Need Help?

1. Check error logs in the `logs/` directory
2. Review error screenshots (created automatically on failures)
3. Run with `--no-headless` to see what's happening
4. Verify your configuration matches your form structure

## Example Commands Reference

```bash
# Validate data
node src/index.js validate -f data/staff.csv

# Fill form (visible browser for debugging)
node src/index.js fill -f data/staff.csv -c config.json --no-headless

# Fill form (headless, production mode)
node src/index.js fill -f data/staff.csv -c config.json

# Fill with custom delay (5 seconds between submissions)
node src/index.js fill -f data/staff.csv -c config.json -d 5000

# Create new config file
node src/index.js create-config -o my-config.json

# Show help
node src/index.js --help
node src/index.js fill --help
```

Happy Automating! 🚀
