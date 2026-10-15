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
            <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"/>
              <path d="M9 13h2v5a1 1 0 11-2 0v-5z"/>
            </svg>
            Step 3: Upload Your Data File
          </h3>
          <button
            onClick={onBack}
            className="text-sm px-4 py-2 border-2 border-gray-400 rounded-lg hover:bg-gray-100 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back
          </button>
        </div>
      </div>

      {/* Instructions Reminder */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
        <p className="text-yellow-800 font-semibold mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
          </svg>
          Remember: Your file must match the configuration
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
              <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
              </svg>
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
              {isValidating ? (
                <svg className="w-24 h-24 mx-auto mb-4 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : validationResults ? (
                <svg className="w-24 h-24 mx-auto mb-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                </svg>
              )}
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
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
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
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Ready to submit {validationResults.summary.valid} valid records!
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
              <p className="text-red-800 font-semibold flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
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
                <svg className="w-7 h-7 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
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
