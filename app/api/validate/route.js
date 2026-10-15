import { NextResponse } from 'next/server';
import { parseFile } from '@/src/fileParser';
import { validateStaffRecords, sanitizeStaffRecord } from '@/src/validator';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export async function POST(request) {
  let tempFilePath = null;

  try {
    // Get the uploaded file
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    const fileName = file.name;
    const fileExtension = '.' + fileName.split('.').pop().toLowerCase();
    const validExtensions = ['.csv', '.xlsx', '.xls', '.docx'];

    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload CSV, Excel, or DOCX files only.' },
        { status: 400 }
      );
    }

    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    tempFilePath = join(tmpdir(), `upload-${Date.now()}${fileExtension}`);
    await writeFile(tempFilePath, buffer);

    // Parse the file
    let staffRecords = await parseFile(tempFilePath);

    if (!staffRecords || staffRecords.length === 0) {
      return NextResponse.json(
        { error: 'No records found in the file' },
        { status: 400 }
      );
    }

    // Sanitize data
    staffRecords = staffRecords.map(record => sanitizeStaffRecord(record));

    // Validate data
    const validation = validateStaffRecords(staffRecords, {
      strictMode: false,
      checkEmailDomain: true
    });

    // Clean up temp file
    if (tempFilePath) {
      await unlink(tempFilePath).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      summary: validation.summary,
      results: validation.results,
      message: validation.valid 
        ? 'All records validated successfully' 
        : `${validation.summary.invalid} invalid records found`
    });

  } catch (error) {
    console.error('Validation error:', error);

    // Clean up temp file
    if (tempFilePath) {
      await unlink(tempFilePath).catch(() => {});
    }

    return NextResponse.json(
      { error: error.message || 'An error occurred during validation' },
      { status: 500 }
    );
  }
}

// Config for Next.js App Router
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
