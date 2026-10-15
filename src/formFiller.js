const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * FormFiller class to automate Google Form submissions
 */
class FormFiller {
  constructor(config) {
    this.formUrl = config.formUrl;
    this.fieldMappings = config.fieldMappings || {};
    this.headless = config.headless !== false; // Default to true
    this.delayBetweenSubmissions = config.delayBetweenSubmissions || 2000; // 2 seconds default
    this.screenshotOnError = config.screenshotOnError !== false; // Default to true
    this.browser = null;
    this.page = null;
  }

  /**
   * Initialize the browser and page
   */
  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: this.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      this.page = await this.browser.newPage();
      await this.page.setViewport({ width: 1280, height: 800 });
      
      return true;
    } catch (error) {
      throw new Error(`Failed to initialize browser: ${error.message}`);
    }
  }

  /**
   * Navigate to the Google Form
   */
  async navigateToForm() {
    try {
      await this.page.goto(this.formUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait a bit for form to fully load
      await this.page.waitForTimeout(1000);
      
      return true;
    } catch (error) {
      throw new Error(`Failed to navigate to form: ${error.message}`);
    }
  }

  /**
   * Fill a text input field
   */
  async fillTextField(selector, value) {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      await this.page.click(selector);
      await this.page.type(selector, String(value), { delay: 50 });
    } catch (error) {
      throw new Error(`Failed to fill text field ${selector}: ${error.message}`);
    }
  }

  /**
   * Select a dropdown option by visible text
   */
  async selectDropdown(selector, value) {
    try {
      // Click the dropdown to open it
      await this.page.waitForSelector(selector, { timeout: 5000 });
      await this.page.click(selector);
      await this.page.waitForTimeout(500);
      
      // Find and click the option with matching text
      const optionSelector = `div[role="option"]:has-text("${value}")`;
      
      // Alternative approach: find all options and match text
      const options = await this.page.$$('div[role="option"]');
      
      for (const option of options) {
        const text = await option.evaluate(el => el.textContent);
        if (text.trim() === value.trim()) {
          await option.click();
          await this.page.waitForTimeout(300);
          return;
        }
      }
      
      throw new Error(`Option "${value}" not found in dropdown`);
    } catch (error) {
      throw new Error(`Failed to select dropdown ${selector} with value "${value}": ${error.message}`);
    }
  }

  /**
   * Fill a single staff record into the form
   */
  async fillStaffRecord(staffData) {
    try {
      // Map each field according to the configuration
      for (const [fieldKey, fieldConfig] of Object.entries(this.fieldMappings)) {
        const value = staffData[fieldKey];
        
        // Skip if value is empty or undefined
        if (!value || value === '') {
          if (fieldConfig.required) {
            throw new Error(`Required field "${fieldKey}" is missing`);
          }
          continue;
        }

        const selector = fieldConfig.selector;
        const type = fieldConfig.type || 'text';

        switch (type) {
          case 'text':
          case 'email':
            await this.fillTextField(selector, value);
            break;
          case 'dropdown':
            await this.selectDropdown(selector, value);
            break;
          default:
            throw new Error(`Unsupported field type: ${type}`);
        }

        // Small delay between fields
        await this.page.waitForTimeout(300);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Submit the form
   */
  async submitForm() {
    try {
      // Look for submit button (Google Forms typically uses specific text)
      const submitButton = await this.page.$('span:has-text("Submit")') || 
                          await this.page.$('div[role="button"]:has-text("Submit")') ||
                          await this.page.$('button:has-text("Submit")');
      
      if (!submitButton) {
        // Try generic approach
        const buttons = await this.page.$$('div[role="button"], button');
        for (const button of buttons) {
          const text = await button.evaluate(el => el.textContent);
          if (text.toLowerCase().includes('submit')) {
            await button.click();
            await this.page.waitForTimeout(2000);
            return true;
          }
        }
        throw new Error('Submit button not found');
      }

      await submitButton.click();
      
      // Wait for submission to complete
      await this.page.waitForTimeout(2000);
      
      // Check for confirmation message
      await this.page.waitForSelector('div.freebirdFormviewerViewResponseConfirmationMessage, div:has-text("Your response has been recorded")', 
        { timeout: 5000 }
      ).catch(() => {
        console.warn('Could not confirm submission message, but form may have been submitted');
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to submit form: ${error.message}`);
    }
  }

  /**
   * Navigate to submit another response
   */
  async submitAnotherResponse() {
    try {
      // Look for "Submit another response" link
      const anotherResponseLink = await this.page.$('a:has-text("Submit another response")');
      
      if (anotherResponseLink) {
        await anotherResponseLink.click();
        await this.page.waitForTimeout(1500);
      } else {
        // If link not found, reload the form
        await this.navigateToForm();
      }

      return true;
    } catch (error) {
      // Fallback: reload the form
      await this.navigateToForm();
      return true;
    }
  }

  /**
   * Process multiple staff records
   */
  async processStaffRecords(staffRecords, options = {}) {
    const results = {
      total: staffRecords.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    const onProgress = options.onProgress || (() => {});

    for (let i = 0; i < staffRecords.length; i++) {
      const staff = staffRecords[i];
      const recordNumber = i + 1;

      try {
        onProgress({
          current: recordNumber,
          total: results.total,
          staff: staff,
          status: 'processing'
        });

        // Fill the form
        await this.fillStaffRecord(staff);

        // Submit the form
        await this.submitForm();

        results.successful++;

        onProgress({
          current: recordNumber,
          total: results.total,
          staff: staff,
          status: 'success'
        });

        // If not the last record, prepare for next submission
        if (i < staffRecords.length - 1) {
          await this.submitAnotherResponse();
          await this.page.waitForTimeout(this.delayBetweenSubmissions);
        }

      } catch (error) {
        results.failed++;
        results.errors.push({
          recordNumber: recordNumber,
          staff: staff,
          error: error.message
        });

        onProgress({
          current: recordNumber,
          total: results.total,
          staff: staff,
          status: 'error',
          error: error.message
        });

        // Take screenshot on error if enabled
        if (this.screenshotOnError) {
          const screenshotPath = path.join('logs', `error-record-${recordNumber}-${Date.now()}.png`);
          await this.page.screenshot({ path: screenshotPath });
        }

        // Try to recover for next record
        try {
          await this.navigateToForm();
          await this.page.waitForTimeout(1000);
        } catch (recoverError) {
          console.error(`Failed to recover after error: ${recoverError.message}`);
        }
      }
    }

    return results;
  }

  /**
   * Close the browser
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  /**
   * Get current page for debugging
   */
  getPage() {
    return this.page;
  }
}

module.exports = FormFiller;
