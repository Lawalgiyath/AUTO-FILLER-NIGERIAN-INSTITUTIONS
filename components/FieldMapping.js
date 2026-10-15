'use client';

import { useState } from 'react';

export default function FieldMapping({ detectedFields, onMappingComplete, onBack }) {
  const [csvColumns, setCsvColumns] = useState([
    'Title', 'Surname', 'FirstName', 'MiddleName', 'Email',
    'Faculty', 'Department', 'Rank', 'EmploymentStatus'
  ]);
  
  const [mapping, setMapping] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  const handleMappingChange = (formField, csvColumn) => {
    setMapping(prev => ({
      ...prev,
      [formField]: csvColumn
    }));
  };

  const handleAutoMap = () => {
    const autoMapping = {};
    
    detectedFields.forEach(formField => {
      const fieldNameLower = formField.name.toLowerCase();
      
      // Try to find matching CSV column
      const match = csvColumns.find(col => {
        const colLower = col.toLowerCase();
        return fieldNameLower.includes(colLower) || 
               colLower.includes(fieldNameLower) ||
               (fieldNameLower.includes('name') && colLower.includes('name')) ||
               (fieldNameLower.includes('email') && colLower === 'email') ||
               (fieldNameLower.includes('title') && colLower === 'title');
      });
      
      if (match) {
        autoMapping[formField.id] = match;
      }
    });
    
    setMapping(autoMapping);
  };

  const handleContinue = () => {
    // Check if all required fields are mapped
    const requiredFields = detectedFields.filter(f => f.required);
    const unmappedRequired = requiredFields.filter(f => !mapping[f.id]);
    
    if (unmappedRequired.length > 0) {
      alert('Please map all required fields before continuing');
      return;
    }
    
    onMappingComplete(mapping);
  };

  const isMapped = (fieldId) => !!mapping[fieldId];
  const getMappedCount = () => Object.keys(mapping).length;

  return (
    <div className="fade-in">
      <div className="card-unilag p-8">
        <h3 className="text-2xl font-bold text-unilag-maroon mb-6 flex items-center justify-between">
          <span className="flex items-center">
            <span className="text-3xl mr-3">🗺️</span>
            Step 2: Map Your Data Fields
          </span>
          <button
            onClick={onBack}
            className="text-sm px-4 py-2 border-2 border-gray-400 rounded-lg hover:bg-gray-100"
          >
            ← Back
          </button>
        </h3>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
          <p className="text-blue-800 font-semibold mb-2">
            📌 What is Field Mapping?
          </p>
          <p className="text-blue-700 text-sm">
            We detected {detectedFields.length} fields in your Google Form. 
            Now tell us which column in your CSV/Excel file corresponds to each form field.
          </p>
        </div>

        {/* Auto-Map Button */}
        <div className="mb-6">
          <button
            onClick={handleAutoMap}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 shadow-lg flex items-center"
          >
            <span className="text-xl mr-2">⚡</span>
            Auto-Map Fields (Smart Match)
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Try to automatically match form fields with your CSV columns
          </p>
        </div>

        {/* Mapping Progress */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">
              Mapping Progress: {getMappedCount()} / {detectedFields.length}
            </span>
            <span className="text-sm text-gray-600">
              {getMappedCount() === detectedFields.length ? '✅ All fields mapped!' : '⏳ In progress...'}
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-3">
            <div
              className="bg-unilag-maroon h-3 rounded-full transition-all"
              style={{ width: `${(getMappedCount() / detectedFields.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Mapping Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-unilag-maroon text-white">
              <tr>
                <th className="px-4 py-3 text-left">Form Field</th>
                <th className="px-4 py-3 text-left">Field Type</th>
                <th className="px-4 py-3 text-left">Required?</th>
                <th className="px-4 py-3 text-left">Your CSV Column</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {detectedFields.map((field, index) => (
                <tr
                  key={field.id}
                  className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-unilag-light`}
                >
                  <td className="px-4 py-4 font-semibold text-gray-800">
                    {field.name}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {field.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {field.required ? (
                      <span className="text-red-600 font-semibold">✓ Yes</span>
                    ) : (
                      <span className="text-gray-500">Optional</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={mapping[field.id] || ''}
                      onChange={(e) => handleMappingChange(field.id, e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-unilag-maroon focus:outline-none"
                    >
                      <option value="">-- Select Column --</option>
                      {csvColumns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {isMapped(field.id) ? (
                      <span className="text-2xl">✅</span>
                    ) : (
                      <span className="text-2xl">⏳</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Preview Mapping Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-unilag-maroon font-semibold underline hover:text-unilag-dark"
          >
            {showPreview ? '▼ Hide' : '▶'} Preview Mapping
          </button>
        </div>

        {/* Mapping Preview */}
        {showPreview && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
            <h4 className="font-bold mb-3">Mapping Summary:</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(mapping).map(([fieldId, csvColumn]) => {
                const field = detectedFields.find(f => f.id === fieldId);
                return (
                  <div key={fieldId} className="bg-white p-3 rounded border">
                    <p className="text-sm text-gray-600">Form Field:</p>
                    <p className="font-semibold text-unilag-maroon">{field?.name}</p>
                    <p className="text-sm text-gray-600 mt-1">Maps to CSV Column:</p>
                    <p className="font-semibold text-green-600">{csvColumn}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {getMappedCount() < detectedFields.length && (
              <p className="text-yellow-600 font-semibold">
                ⚠️ {detectedFields.length - getMappedCount()} field(s) still need mapping
              </p>
            )}
          </div>
          <button
            onClick={handleContinue}
            disabled={getMappedCount() === 0}
            className="btn-unilag px-8 py-3 rounded-lg font-bold shadow-lg flex items-center"
          >
            Continue to File Upload
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
