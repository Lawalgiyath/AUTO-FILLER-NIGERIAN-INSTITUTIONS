'use client';

import { useState, useRef } from 'react';

export default function UploadAndSubmit({ 
  fieldMapping, 
  formUrl, 
  onDataUploaded, 
  onStartSubmission, 
  onBack,
  onShowInstructions 
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (file) => {
    const validExtensions = ['.csv', '.xlsx', '.xls', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (validExtensions.includes(fileExtension)) {
      setSelectedFile(file);
      await validateFile(file);
    } else {
      alert('Invalid file type. Please upload CSV, Excel, or DOCX files only.');
    }
  };

  const validateFile = async (file) => {
    setIsValidating(true);
    setValidationResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mapping', JSON.stringify(fieldMapping));

      const response = await fetch('/api/validate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setValidationResults(data);
        onDataUploaded(data);
      } else {
        alert('Validation failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('An error occurred while validating the file');
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const canSubmit = validationResults && validationResults.summary.valid > 0;

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="card-unilag p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-unilag-maroon flex items-center">
            <span className="text-3xl mr-3">📤</span>
            Step 3: Upload Your Data File
          </h3>
          <button
            onClick={onBack}
            className="text-sm px-4 py-2 border-2 border-gray-400 rounded-lg hover:bg-gray-100"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Instructions Reminder */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
        <p className="text-yellow-800 font-semibold mb-2">
          📋 Remember: Your file must match the configuration
        </p>
        <button
          onClick={onShowInstructions}
          className="text-unilag-maroon font-semibold underline hover:text-unilag-dark"
        >
          Click here to review data format instructions
        </button>
      </div>

      {/* Upload Area */}
      <div className="card-unilag p-8">
        <div
          className={`relative border-4 border-dashed rounded-xl p-12 transition-all ${
            dragActive
              ? 'border-unilag-maroon bg-unilag-light'
              : 'border-gray-300 hover:border-unilag-maroon'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".csv,.xlsx,.xls,.docx"
            onChange={handleFileInputChange}
            disabled={isValidating}
          />

          {!selectedFile ? (
            <div className="text-center">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Drag and drop your file here
              </p>
              <p className="text-gray-500 mb-6">or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-unilag px-8 py-3 rounded-lg font-semibold shadow-lg"
                disabled={isValidating}
              >
                Browse Files
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: CSV, Excel (.xlsx, .xls), Word (.docx)
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4">
                {isValidating ? '⏳' : validationResults ? '✅' : '📄'}
              </div>
              <p className="text-xl font-semibold text-unilag-maroon mb-2">
                {isValidating ? 'Validating...' : 'File Uploaded'}
              </p>
              <div className="bg-unilag-light p-4 rounded-lg inline-block mb-4">
                <p className="font-semibold text-gray-800">{selectedFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              {!isValidating && (
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleRemoveFile}
                    className="px-6 py-2 border-2 border-gray-400 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Remove File
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Validation Results */}
      {validationResults && (
        <div className="card-unilag p-8">
          <h4 className="text-xl font-bold text-unilag-maroon mb-4 flex items-center">
            <span className="text-2xl mr-2">📊</span>
            Validation Results
          </h4>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-600">{validationResults.summary.total}</p>
              <p className="text-sm text-gray-600">Total Records</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-600">{validationResults.summary.valid}</p>
              <p className="text-sm text-gray-600">Valid</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-red-600">{validationResults.summary.invalid}</p>
              <p className="text-sm text-gray-600">Invalid</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-yellow-600">{validationResults.summary.warnings}</p>
              <p className="text-sm text-gray-600">Warnings</p>
            </div>
          </div>

          {canSubmit ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
              <p className="text-green-800 font-semibold flex items-center">
                <span className="text-2xl mr-2">✅</span>
                Ready to submit {validationResults.summary.valid} valid records!
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
              <p className="text-red-800 font-semibold flex items-center">
                <span className="text-2xl mr-2">❌</span>
                No valid records found. Please fix errors and re-upload.
              </p>
            </div>
          )}

          {/* Start Submission Button */}
          {canSubmit && (
            <div className="mt-6">
              <button
                onClick={onStartSubmission}
                className="btn-unilag w-full py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center"
              >
                <span className="text-2xl mr-3">🚀</span>
                Start Auto-Submission ({validationResults.summary.valid} records)
              </button>
              <p className="text-center text-sm text-gray-600 mt-3">
                Estimated time: ~{Math.ceil(validationResults.summary.valid * 2 / 60)} minutes
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
