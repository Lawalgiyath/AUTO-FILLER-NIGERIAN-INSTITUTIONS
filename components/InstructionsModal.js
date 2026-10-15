'use client';

import { useState } from 'react';

export default function InstructionsModal({ onConfirm, onClose }) {
  const [hasChecked, setHasChecked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl fade-in">
        {/* Header */}
        <div className="unilag-gradient text-white p-6 sticky top-0 z-10">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-3">📋</span>
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
            <h3 className="text-xl font-bold text-unilag-maroon mb-3">
              📝 Required Fields
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
            <h3 className="text-xl font-bold text-unilag-maroon mb-3">
              📄 Supported File Formats
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="card-unilag p-4 text-center">
                <p className="text-3xl mb-2">📊</p>
                <p className="font-bold text-unilag-maroon">CSV</p>
                <p className="text-sm text-gray-600">.csv files</p>
              </div>
              <div className="card-unilag p-4 text-center">
                <p className="text-3xl mb-2">📈</p>
                <p className="font-bold text-unilag-maroon">Excel</p>
                <p className="text-sm text-gray-600">.xlsx, .xls</p>
              </div>
              <div className="card-unilag p-4 text-center">
                <p className="text-3xl mb-2">📝</p>
                <p className="font-bold text-unilag-maroon">Word</p>
                <p className="text-sm text-gray-600">.docx (table format)</p>
              </div>
            </div>
          </section>

          {/* Valid Values Section */}
          <section className="border-l-4 border-green-500 pl-4">
            <h3 className="text-xl font-bold text-unilag-maroon mb-3">
              ✅ Valid Values
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
            <h3 className="text-xl font-bold text-unilag-maroon mb-3">
              💡 Example CSV Format
            </h3>
            <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">
{`Title,Surname,FirstName,MiddleName,Email,Faculty,Department,Rank,EmploymentStatus
Prof,Adeyemi,Oluwaseun,Babatunde,o.adeyemi@unilag.edu.ng,Faculty of Science,Computer Science,Professor,Full Time
Dr,Okonkwo,Chioma,Ngozi,c.okonkwo@unilag.edu.ng,Faculty of Engineering,Electrical Engineering,Senior Lecturer,Full Time`}
            </pre>
          </section>

          {/* Important Notes */}
          <section className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h3 className="text-xl font-bold text-yellow-800 mb-3">
              ⚠️ Important Notes
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
