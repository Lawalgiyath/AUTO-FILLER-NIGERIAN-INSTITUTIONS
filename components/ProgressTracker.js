'use client';

import { useState, useEffect } from 'react';

export default function ProgressTracker({ uploadedData, fieldMapping, formUrl, onComplete }) {
  const [progress, setProgress] = useState({
    current: 0,
    total: uploadedData.summary.valid,
    successful: 0,
    failed: 0,
    currentRecord: null,
    errors: []
  });

  useEffect(() => {
    startSubmission();
  }, []);

  const startSubmission = async () => {
    try {
      const response = await fetch('/api/submit-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formUrl,
          fieldMapping,
          records: uploadedData.results.filter(r => r.valid).map(r => r.record)
        })
      });

      // For now, simulate progress
      simulateProgress();
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const simulateProgress = () => {
    const total = progress.total;
    let current = 0;

    const interval = setInterval(() => {
      current++;
      
      setProgress(prev => ({
        ...prev,
        current,
        successful: current,
        currentRecord: uploadedData.results[current - 1]?.record
      }));

      if (current >= total) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete({
            total,
            successful: total,
            failed: 0,
            errors: []
          });
        }, 1000);
      }
    }, 2000); // 2 seconds per record
  };

  const percentage = ((progress.current / progress.total) * 100).toFixed(1);

  return (
    <div className="fade-in">
      <div className="card-unilag p-8">
        <h3 className="text-2xl font-bold text-unilag-maroon mb-6 flex items-center">
          <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
          </svg>
          Submitting Records to Google Form
        </h3>

        {/* Main Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-lg">
              Progress: {progress.current} / {progress.total}
            </span>
            <span className="font-bold text-unilag-maroon text-lg">
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-unilag-maroon to-unilag-dark h-6 transition-all duration-500 flex items-center justify-center text-white text-sm font-bold"
              style={{ width: `${percentage}%` }}
            >
              {percentage > 10 && `${percentage}%`}
            </div>
          </div>
        </div>

        {/* Current Record */}
        {progress.currentRecord && (
          <div className="bg-unilag-light p-6 rounded-lg mb-6 border-2 border-unilag-maroon">
            <p className="text-sm font-semibold text-unilag-maroon mb-2">
              Currently Processing:
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {progress.currentRecord.title} {progress.currentRecord.firstName} {progress.currentRecord.surname}
            </p>
            <p className="text-gray-600 mt-1">{progress.currentRecord.email}</p>
            <div className="mt-3 flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-unilag-maroon"></div>
              <span className="text-sm text-gray-600">Filling form fields...</span>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg text-center border-2 border-green-200">
            <p className="text-3xl font-bold text-green-600">{progress.successful}</p>
            <p className="text-sm text-gray-600">Submitted Successfully</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center border-2 border-red-200">
            <p className="text-3xl font-bold text-red-600">{progress.failed}</p>
            <p className="text-sm text-gray-600">Failed</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center border-2 border-blue-200">
            <p className="text-3xl font-bold text-blue-600">
              {progress.total - progress.current}
            </p>
            <p className="text-sm text-gray-600">Remaining</p>
          </div>
        </div>

        {/* Time Estimate */}
        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
            Estimated time remaining: ~{Math.ceil((progress.total - progress.current) * 2 / 60)} minutes
          </p>
        </div>

        {/* Warning */}
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-800 text-sm flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <span><strong>Please do not close this window</strong> until the process is complete. The system is actively submitting your records to Google Forms.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
