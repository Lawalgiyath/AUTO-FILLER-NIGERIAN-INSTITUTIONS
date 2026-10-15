'use client';

import { useState } from 'react';

export default function InstructionsModal({ onConfirm, onClose, fieldMapping }) {
  const [hasChecked, setHasChecked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl fade-in">
        {/* Header */}
        <div className="unilag-gradient text-white p-6 sticky top-0 z-10">
          <h2 className="text-2xl font-bold flex items-center">
            <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
            Data Preparation Instructions
          </h2>
          <p className="mt-2 text-unilag-gold">
            Please read carefully before uploading your file
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Required Fields Section */}
          <section className="border-l-4 border-unilag-maroon pl-4">
            <h3 className="text-xl font-bold text-unilag-maroon mb-3 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"/>
              </svg>
              Required Fields
            </h3>
            <p className="text-gray-700 mb-3">
              Your file must include these columns (column names are case-insensitive):
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { name: 'Title', example: 'Prof, Dr, Mr, Mrs, Ms' },
                { name: 'Surname', example: 'Last name' },
                { name: 'FirstName', example: 'First name' },
                { name: 'MiddleName', example: 'Optional' },
                { name: 'Email', example: 'name@unilag.edu.ng' },
                { name: 'Faculty', example: 'Faculty of Science' },
                { name: 'Department', example: 'Computer Science' },
                { name: 'Rank', example: 'Professor, Lecturer I, etc.' },
                { name: 'EmploymentStatus', example: 'Full Time, Contract, etc.' },
              ].map((field) => (
                <div key={field.name} className="bg-unilag-light p-3 rounded">
                  <p className="font-semibold text-unilag-dark">{field.name}</p>
                  <p className="text-sm text-gray-600">{field.example}</p>
                </div>
              ))}
            </div>
          </section>

          {/* File Formats Section */}
          <section className="border-l-4 border-unilag-gold pl-4">
            <h3 className="text-xl font-bold text-unilag-maroon mb-3 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
              </svg>
              Supported File Formats
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="card-unilag p-4 text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-unilag-maroon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"/>
                </svg>
                <p className="font-bold text-unilag-maroon">CSV</p>
                <p className="text-sm text-gray-600">.csv files</p>
              </div>
              <div className="card-unilag p-4 text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-unilag-maroon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                </svg>
                <p className="font-bold text-unilag-maroon">Excel</p>
                <p className="text-sm text-gray-600">.xlsx, .xls</p>
              </div>
              <div className="card-unilag p-4 text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-unilag-maroon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                </svg>
                <p className="font-bold text-unilag-maroon">Word</p>
                <p className="text-sm text-gray-600">.docx (table format)</p>
              </div>
            </div>
          </section>

          {/* Valid Values Section */}
          <section className="border-l-4 border-green-500 pl-4">
            <h3 className="text-xl font-bold text-unilag-maroon mb-3 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Valid Values
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-800">Titles:</p>
                <p className="text-gray-600">Prof, Assoc. Prof, Dr, Mr, Mrs, Ms</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Ranks:</p>
                <p className="text-gray-600">
                  Professor, Associate Professor, Senior Lecturer, Lecturer I, 
                  Lecturer II, Assistant Lecturer, Research Fellow
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Employment Status:</p>
                <p className="text-gray-600">Full Time, Contract, Adjunct, Part Time, Visiting</p>
              </div>
            </div>
          </section>

          {/* Example Section */}
          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-unilag-maroon mb-3 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
              </svg>
              Example CSV Format
            </h3>
            <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`Title,Surname,FirstName,MiddleName,Email,Faculty,Department,Rank,EmploymentStatus
Prof,Adeyemi,Oluwaseun,Babatunde,o.adeyemi@unilag.edu.ng,Faculty of Science,Computer Science,Professor,Full Time
Dr,Okonkwo,Chioma,Ngozi,c.okonkwo@unilag.edu.ng,Faculty of Engineering,Electrical Engineering,Senior Lecturer,Full Time`}
            </pre>
          </section>

          {/* Important Notes */}
          <section className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h3 className="text-xl font-bold text-yellow-800 mb-3 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              Important Notes
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Column names are case-insensitive</li>
              <li>Middle name is optional and can be left empty</li>
              <li>Email must be in valid format (name@domain.com)</li>
              <li>All other fields are required</li>
              <li>The system will validate your data before processing</li>
            </ul>
          </section>

          {/* Confirmation Checkbox */}
          <div className="bg-unilag-light border-2 border-unilag-maroon rounded-lg p-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasChecked}
                onChange={(e) => setHasChecked(e.target.checked)}
                className="checkbox-unilag w-5 h-5 mt-1 flex-shrink-0"
              />
              <span className="text-gray-800 font-semibold">
                I have read and understood the data preparation instructions. 
                My file follows the required format with all necessary columns.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 flex justify-end space-x-4 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-unilag-maroon text-unilag-maroon rounded-lg font-semibold hover:bg-unilag-light transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!hasChecked}
            className="btn-unilag px-8 py-3 rounded-lg font-semibold shadow-lg"
          >
            Continue to Upload
          </button>
        </div>
      </div>
    </div>
  );
}
