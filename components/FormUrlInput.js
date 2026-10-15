'use client';

import { useState } from 'react';

export default function FormUrlInput({ onFormAnalyzed }) {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a Google Form URL');
      return;
    }

    if (!url.includes('docs.google.com/forms')) {
      setError('Please enter a valid Google Forms URL');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formUrl: url }),
      });

      const data = await response.json();

      if (response.ok) {
        onFormAnalyzed(url, data.fields);
      } else {
        setError(data.error || 'Failed to analyze form');
      }
    } catch (err) {
      setError('An error occurred while analyzing the form');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fade-in">
      {/* Welcome Card */}
      <div className="card-unilag p-8 mb-8">
        <h2 className="text-3xl font-bold text-unilag-maroon mb-4 flex items-center">
          <span className="text-4xl mr-3">🎓</span>
          Welcome to UNILAG Staff Form AutoFiller
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          This system automatically fills Google Forms with your staff information. 
          Simply paste your Google Form URL, map your data fields, and let the system 
          handle the rest!
        </p>
      </div>

      {/* How It Works */}
      <div className="card-unilag p-6 mb-8">
        <h3 className="text-xl font-bold text-unilag-maroon mb-4 flex items-center">
          <span className="text-2xl mr-2">📋</span>
          How It Works
        </h3>
        <div className="grid md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="bg-unilag-light rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 text-xl font-bold text-unilag-maroon">
              1
            </div>
            <p className="text-sm font-semibold">Enter Form URL</p>
          </div>
          <div className="text-center">
            <div className="bg-unilag-light rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 text-xl font-bold text-unilag-maroon">
              2
            </div>
            <p className="text-sm font-semibold">Auto-Detect Fields</p>
          </div>
          <div className="text-center">
            <div className="bg-unilag-light rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 text-xl font-bold text-unilag-maroon">
              3
            </div>
            <p className="text-sm font-semibold">Map Your Data</p>
          </div>
          <div className="text-center">
            <div className="bg-unilag-light rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 text-xl font-bold text-unilag-maroon">
              4
            </div>
            <p className="text-sm font-semibold">Upload File</p>
          </div>
          <div className="text-center">
            <div className="bg-unilag-light rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 text-xl font-bold text-unilag-maroon">
              5
            </div>
            <p className="text-sm font-semibold">Auto-Submit!</p>
          </div>
        </div>
      </div>

      {/* Main Form URL Input */}
      <div className="card-unilag p-8">
        <h3 className="text-2xl font-bold text-unilag-maroon mb-6 flex items-center">
          <span className="text-3xl mr-3">🔗</span>
          Step 1: Enter Your Google Form URL
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Google Form URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="https://docs.google.com/forms/d/e/..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-unilag-maroon focus:outline-none text-lg"
              disabled={isAnalyzing}
            />
            <p className="text-sm text-gray-500 mt-2">
              📌 Paste the full URL of your Google Form here
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 font-semibold flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-800 font-semibold mb-2">💡 How to get your Form URL:</p>
            <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm">
              <li>Open your Google Form</li>
              <li>Click the "Send" button</li>
              <li>Click the link icon (🔗)</li>
              <li>Copy the URL and paste it above</li>
            </ol>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !url.trim()}
            className="btn-unilag w-full py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
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
                Analyzing Form...
              </>
            ) : (
              <>
                <span className="text-2xl mr-2">🔍</span>
                Analyze Form & Detect Fields
              </>
            )}
          </button>
        </div>
      </div>

      {/* Example Forms Section */}
      <div className="mt-8 card-unilag p-6">
        <h4 className="font-bold text-unilag-maroon mb-3 flex items-center">
          <span className="text-xl mr-2">📝</span>
          Need a Test Form?
        </h4>
        <p className="text-gray-600 text-sm mb-3">
          Don't have a form ready? Create a Google Form with these fields for testing:
        </p>
        <div className="bg-gray-50 p-4 rounded border border-gray-300">
          <p className="font-semibold text-sm mb-2">Required Form Fields:</p>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
            <div>• Title (Short answer or Dropdown)</div>
            <div>• Surname (Short answer)</div>
            <div>• First Name (Short answer)</div>
            <div>• Email (Email field)</div>
            <div>• Faculty (Dropdown or Short answer)</div>
            <div>• Department (Short answer)</div>
            <div>• Rank (Dropdown or Short answer)</div>
            <div>• Employment Status (Dropdown)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
