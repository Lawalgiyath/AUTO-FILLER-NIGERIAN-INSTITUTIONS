'use client';

import { useState, useRef } from 'react';

export default function UploadSection({ hasReadInstructions, onFileUpload, isProcessing }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
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

  const handleFileSelect = (file) => {
    const validExtensions = ['.csv', '.xlsx', '.xls', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (validExtensions.includes(fileExtension)) {
      setSelectedFile(file);
    } else {
      alert('Invalid file type. Please upload CSV, Excel, or DOCX files only.');
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!hasReadInstructions) {
    return (
      <div className="card-unilag p-12 text-center fade-in">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-2xl font-bold text-unilag-maroon mb-4">
          Instructions Required
        </h3>
        <p className="text-gray-600 text-lg">
          Please read and confirm the data preparation instructions to continue.
        </p>
      </div>
    );
  }

  return (
    <div id="upload" className="card-unilag p-8 fade-in">
      <h3 className="text-2xl font-bold text-unilag-maroon mb-6">
        📤 Upload Staff Data File
      </h3>

      {/* Drag and Drop Area */}
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
          disabled={isProcessing}
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
              disabled={isProcessing}
            >
              Browse Files
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Supported formats: CSV, Excel (.xlsx, .xls), Word (.docx)
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-xl font-semibold text-unilag-maroon mb-2">
              File Selected
            </p>
            <div className="bg-unilag-light p-4 rounded-lg inline-block mb-4">
              <p className="font-semibold text-gray-800">{selectedFile.name}</p>
              <p className="text-sm text-gray-600">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRemoveFile}
                className="px-6 py-2 border-2 border-gray-400 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                disabled={isProcessing}
              >
                Remove
              </button>
              <button
                onClick={handleSubmit}
                className="btn-unilag px-8 py-2 rounded-lg font-semibold shadow-lg flex items-center"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Validate & Process'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* File Type Info */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <span className="text-2xl">✓</span>
          <div>
            <p className="font-semibold text-green-800">CSV Files</p>
            <p className="text-sm text-green-600">Comma-separated values</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <span className="text-2xl">✓</span>
          <div>
            <p className="font-semibold text-blue-800">Excel Files</p>
            <p className="text-sm text-blue-600">.xlsx and .xls formats</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
          <span className="text-2xl">✓</span>
          <div>
            <p className="font-semibold text-purple-800">Word Files</p>
            <p className="text-sm text-purple-600">.docx table format</p>
          </div>
        </div>
      </div>
    </div>
  );
}
