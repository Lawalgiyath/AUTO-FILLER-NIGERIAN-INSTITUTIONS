import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { formUrl } = await request.json();

    if (!formUrl || !formUrl.includes('docs.google.com/forms')) {
      return NextResponse.json(
        { error: 'Invalid Google Form URL' },
        { status: 400 }
      );
    }

    // For now, return mock fields
    // In production, this would use Puppeteer to scrape the actual form
    const mockFields = [
      { id: 'field1', name: 'Title', type: 'dropdown', required: true },
      { id: 'field2', name: 'Surname', type: 'text', required: true },
      { id: 'field3', name: 'First Name', type: 'text', required: true },
      { id: 'field4', name: 'Middle Name', type: 'text', required: false },
      { id: 'field5', name: 'Email', type: 'email', required: true },
      { id: 'field6', name: 'Faculty', type: 'dropdown', required: true },
      { id: 'field7', name: 'Department', type: 'text', required: true },
      { id: 'field8', name: 'Rank', type: 'dropdown', required: true },
      { id: 'field9', name: 'Employment Status', type: 'dropdown', required: true },
    ];

    return NextResponse.json({
      success: true,
      fields: mockFields,
      message: 'Form analyzed successfully'
    });

  } catch (error) {
    console.error('Form analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze form' },
      { status: 500 }
    );
  }
}
