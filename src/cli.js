#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const { parseFile } = require('./fileParser');
const { validateStaffRecords, sanitizeStaffRecord } = require('./validator');
const FormFiller = require('./formFiller');

const program = new Command();

program
  .name('google-form-autofiller')
  .description('Automated system for filling Google Forms with Nigerian university staff information')
  .version('1.0.0');

program
  .command('fill')
  .description('Fill Google Form with staff data from a file')
  .requiredOption('-f, --file <path>', 'Path to the data file (CSV, Excel, or DOCX)')
  .requiredOption('-c, --config <path>', 'Path to the configuration file')
  .option('-h, --headless', 'Run browser in headless mode', true)
  .option('-d, --delay <ms>', 'Delay between submissions in milliseconds', '2000')
  .option('--no-validate', 'Skip data validation')
  .option('--strict', 'Use strict validation mode', false)
  .action(async (options) => {
    console.log(chalk.bold.blue('\n🚀 Google Form AutoFiller\n'));

    try {
      // Step 1: Load configuration
      const spinner = ora('Loading configuration...').start();
      const configPath = path.resolve(options.config);
      
      if (!fs.existsSync(configPath)) {
        spinner.fail(chalk.red('Configuration file not found!'));
        console.log(chalk.yellow(`Please create a config file at: ${configPath}`));
        process.exit(1);
      }

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      spinner.succeed(chalk.green('Configuration loaded'));

      // Step 2: Parse the data file
      spinner.start('Parsing data file...');
      const filePath = path.resolve(options.file);
      
      if (!fs.existsSync(filePath)) {
        spinner.fail(chalk.red('Data file not found!'));
        process.exit(1);
      }

      let staffRecords = await parseFile(filePath);
      spinner.succeed(chalk.green(`Parsed ${staffRecords.length} records from file`));

      if (staffRecords.length === 0) {
        console.log(chalk.yellow('⚠️  No records found in file'));
        process.exit(0);
      }

      // Step 3: Sanitize data
      spinner.start('Sanitizing data...');
      staffRecords = staffRecords.map(record => sanitizeStaffRecord(record));
      spinner.succeed(chalk.green('Data sanitized'));

      // Step 4: Validate data (if not disabled)
      if (options.validate !== false) {
        spinner.start('Validating data...');
        const validationOptions = {
          strictMode: options.strict,
          checkEmailDomain: true
        };
        
        const validation = validateStaffRecords(staffRecords, validationOptions);
        
        if (!validation.valid) {
          spinner.warn(chalk.yellow(`Validation completed with ${validation.summary.invalid} invalid records`));
          
          console.log(chalk.bold('\n📋 Validation Summary:'));
          console.log(chalk.white(`  Total Records: ${validation.summary.total}`));
          console.log(chalk.green(`  ✓ Valid: ${validation.summary.valid}`));
          console.log(chalk.red(`  ✗ Invalid: ${validation.summary.invalid}`));
          console.log(chalk.yellow(`  ⚠ Warnings: ${validation.summary.warnings}`));

          // Show detailed errors
          const invalidRecords = validation.results.filter(r => !r.valid);
          
          if (invalidRecords.length > 0 && invalidRecords.length <= 10) {
            console.log(chalk.bold('\n❌ Validation Errors:'));
            invalidRecords.forEach(result => {
              console.log(chalk.red(`\n  Record #${result.recordNumber}:`));
              result.errors.forEach(error => {
                console.log(chalk.red(`    • ${error}`));
              });
            });
          } else if (invalidRecords.length > 10) {
            console.log(chalk.yellow(`\n⚠️  Too many errors to display. Check log file for details.`));
          }

          // Ask user to confirm
          console.log(chalk.yellow('\n⚠️  Some records have validation errors.'));
          console.log(chalk.white('Invalid records will be skipped during submission.\n'));
          
          // Filter out invalid records
          staffRecords = validation.results.filter(r => r.valid).map(r => r.record);
          console.log(chalk.blue(`✓ Proceeding with ${staffRecords.length} valid records\n`));
          
          if (staffRecords.length === 0) {
            console.log(chalk.red('No valid records to process. Exiting.'));
            process.exit(1);
          }
        } else {
          spinner.succeed(chalk.green('All records validated successfully'));
          
          if (validation.summary.warnings > 0) {
            console.log(chalk.yellow(`⚠️  ${validation.summary.warnings} warning(s) found`));
          }
        }
      }

      // Step 5: Initialize form filler
      spinner.start('Initializing browser...');
      const formFillerConfig = {
        formUrl: config.formUrl,
        fieldMappings: config.fieldMappings,
        headless: options.headless,
        delayBetweenSubmissions: parseInt(options.delay),
        screenshotOnError: true
      };

      const formFiller = new FormFiller(formFillerConfig);
      await formFiller.initialize();
      spinner.succeed(chalk.green('Browser initialized'));

      // Step 6: Navigate to form
      spinner.start('Loading Google Form...');
      await formFiller.navigateToForm();
      spinner.succeed(chalk.green('Form loaded'));

      // Step 7: Process records
      console.log(chalk.bold.blue(`\n📝 Processing ${staffRecords.length} records...\n`));

      const progressBar = ora('Starting...').start();
      
      const results = await formFiller.processStaffRecords(staffRecords, {
        onProgress: (progress) => {
          const { current, total, staff, status, error } = progress;
          
          if (status === 'processing') {
            progressBar.text = chalk.blue(
              `Processing ${current}/${total}: ${staff.firstName} ${staff.surname}`
            );
          } else if (status === 'success') {
            progressBar.succeed(chalk.green(
              `✓ ${current}/${total}: ${staff.firstName} ${staff.surname} - Submitted successfully`
            ));
            progressBar.start();
          } else if (status === 'error') {
            progressBar.fail(chalk.red(
              `✗ ${current}/${total}: ${staff.firstName} ${staff.surname} - ${error}`
            ));
            progressBar.start();
          }
        }
      });

      progressBar.stop();

      // Step 8: Close browser
      await formFiller.close();

      // Step 9: Display results
      console.log(chalk.bold.blue('\n📊 Final Results:\n'));
      console.log(chalk.white(`  Total Records: ${results.total}`));
      console.log(chalk.green(`  ✓ Successful: ${results.successful}`));
      console.log(chalk.red(`  ✗ Failed: ${results.failed}`));

      if (results.errors.length > 0) {
        console.log(chalk.bold.red('\n❌ Failed Records:\n'));
        results.errors.forEach(error => {
          console.log(chalk.red(`  Record #${error.recordNumber}: ${error.staff.firstName} ${error.staff.surname}`));
          console.log(chalk.red(`    Error: ${error.error}\n`));
        });

        // Save error log
        const logPath = path.join('logs', `error-log-${Date.now()}.json`);
        fs.writeFileSync(logPath, JSON.stringify(results.errors, null, 2));
        console.log(chalk.yellow(`Error details saved to: ${logPath}`));
      }

      console.log(chalk.bold.green('\n✅ Process completed!\n'));

    } catch (error) {
      console.error(chalk.bold.red('\n❌ Error:'), error.message);
      console.error(chalk.gray(error.stack));
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate staff data file without submitting')
  .requiredOption('-f, --file <path>', 'Path to the data file (CSV, Excel, or DOCX)')
  .option('--strict', 'Use strict validation mode', false)
  .action(async (options) => {
    console.log(chalk.bold.blue('\n🔍 Data Validation\n'));

    try {
      const spinner = ora('Parsing data file...').start();
      const filePath = path.resolve(options.file);
      
      if (!fs.existsSync(filePath)) {
        spinner.fail(chalk.red('Data file not found!'));
        process.exit(1);
      }

      let staffRecords = await parseFile(filePath);
      spinner.succeed(chalk.green(`Parsed ${staffRecords.length} records`));

      if (staffRecords.length === 0) {
        console.log(chalk.yellow('⚠️  No records found in file'));
        process.exit(0);
      }

      spinner.start('Sanitizing data...');
      staffRecords = staffRecords.map(record => sanitizeStaffRecord(record));
      spinner.succeed(chalk.green('Data sanitized'));

      spinner.start('Validating records...');
      const validation = validateStaffRecords(staffRecords, {
        strictMode: options.strict,
        checkEmailDomain: true
      });
      spinner.stop();

      console.log(chalk.bold('\n📋 Validation Results:\n'));
      console.log(chalk.white(`  Total Records: ${validation.summary.total}`));
      console.log(chalk.green(`  ✓ Valid: ${validation.summary.valid}`));
      console.log(chalk.red(`  ✗ Invalid: ${validation.summary.invalid}`));
      console.log(chalk.yellow(`  ⚠ Warnings: ${validation.summary.warnings}`));

      // Show detailed results
      validation.results.forEach(result => {
        if (!result.valid || result.warnings.length > 0) {
          console.log(chalk.bold(`\nRecord #${result.recordNumber}: ${result.record.firstName} ${result.record.surname}`));
          
          if (result.errors.length > 0) {
            console.log(chalk.red('  Errors:'));
            result.errors.forEach(error => console.log(chalk.red(`    • ${error}`)));
          }
          
          if (result.warnings.length > 0) {
            console.log(chalk.yellow('  Warnings:'));
            result.warnings.forEach(warning => console.log(chalk.yellow(`    • ${warning}`)));
          }
        }
      });

      if (validation.valid) {
        console.log(chalk.bold.green('\n✅ All records are valid!\n'));
      } else {
        console.log(chalk.bold.yellow('\n⚠️  Some records have validation issues\n'));
      }

    } catch (error) {
      console.error(chalk.bold.red('\n❌ Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('create-config')
  .description('Create a sample configuration file')
  .option('-o, --output <path>', 'Output path for config file', 'config.json')
  .action((options) => {
    const sampleConfig = {
      formUrl: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform",
      fieldMappings: {
        title: {
          selector: "div[data-params*='Title'] input, input[aria-label*='Title']",
          type: "dropdown",
          required: true
        },
        surname: {
          selector: "input[aria-label*='Surname'], input[aria-label*='Last Name']",
          type: "text",
          required: true
        },
        firstName: {
          selector: "input[aria-label*='First Name']",
          type: "text",
          required: true
        },
        middleName: {
          selector: "input[aria-label*='Middle Name']",
          type: "text",
          required: false
        },
        email: {
          selector: "input[type='email'], input[aria-label*='Email']",
          type: "email",
          required: true
        },
        faculty: {
          selector: "div[data-params*='Faculty'] input",
          type: "dropdown",
          required: true
        },
        department: {
          selector: "input[aria-label*='Department']",
          type: "text",
          required: true
        },
        rank: {
          selector: "div[data-params*='Rank'] input",
          type: "dropdown",
          required: true
        },
        employmentStatus: {
          selector: "div[data-params*='Employment Status'] input",
          type: "dropdown",
          required: true
        }
      }
    };

    const outputPath = path.resolve(options.output);
    fs.writeFileSync(outputPath, JSON.stringify(sampleConfig, null, 2));
    
    console.log(chalk.green(`✅ Sample configuration created at: ${outputPath}`));
    console.log(chalk.yellow('\n⚠️  Important: You need to update the following:'));
    console.log(chalk.white('  1. Replace YOUR_FORM_ID with your actual Google Form ID'));
    console.log(chalk.white('  2. Update field selectors to match your form structure'));
    console.log(chalk.white('  3. You can find selectors by inspecting the form in browser DevTools\n'));
  });

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
