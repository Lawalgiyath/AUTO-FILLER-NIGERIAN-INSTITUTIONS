'use client';

export default function CompletionReport({ report, onStartOver }) {
  const successRate = ((report.successful / report.total) * 100).toFixed(1);

  return (
    <div className="fade-in">
      <div className="card-unilag p-8 text-center">
        <div className="flex justify-center mb-4">
          {report.failed === 0 ? (
            <svg className="w-20 h-20 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          ) : (
            <svg className="w-20 h-20 text-unilag-maroon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          )}
        </div>
        
        <h2 className="text-3xl font-bold text-unilag-maroon mb-4">
          {report.failed === 0 ? 'Perfect! All Records Submitted!' : 'Submission Complete!'}
        </h2>

        <p className="text-xl text-gray-700 mb-8">
          Your staff data has been processed and submitted to the Google Form.
        </p>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <p className="text-4xl font-bold text-blue-600 mb-2">{report.total}</p>
            <p className="text-gray-700 font-semibold">Total Records</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
            <p className="text-4xl font-bold text-green-600 mb-2">{report.successful}</p>
            <p className="text-gray-700 font-semibold">Successfully Submitted</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
            <p className="text-4xl font-bold text-red-600 mb-2">{report.failed}</p>
            <p className="text-gray-700 font-semibold">Failed</p>
          </div>
        </div>

        {/* Success Rate */}
        <div className="mb-8">
          <p className="text-lg font-semibold text-gray-700 mb-3">
            Success Rate: {successRate}%
          </p>
          <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-6 flex items-center justify-center text-white text-sm font-bold"
              style={{ width: `${successRate}%` }}
            >
              {successRate > 10 && `${successRate}%`}
            </div>
          </div>
        </div>

        {/* Failed Records (if any) */}
        {report.failed > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8 text-left">
            <h4 className="text-lg font-bold text-red-800 mb-3 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              Failed Records ({report.failed})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {report.errors.map((error, index) => (
                <div key={index} className="bg-white p-3 rounded border border-red-200">
                  <p className="font-semibold text-gray-800">
                    Record #{error.recordNumber}: {error.staff?.firstName} {error.staff?.surname}
                  </p>
                  <p className="text-sm text-red-600 mt-1">{error.error}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8 text-left">
          <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
            Next Steps
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Check your Google Form responses to verify submissions</li>
            {report.failed > 0 && (
              <li>Fix the failed records and re-submit them</li>
            )}
            <li>Download this report for your records (optional)</li>
            <li>Share the results with your team</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              const reportData = JSON.stringify(report, null, 2);
              const blob = new Blob([reportData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `submission-report-${Date.now()}.json`;
              a.click();
            }}
            className="px-8 py-3 border-2 border-unilag-maroon text-unilag-maroon rounded-lg font-semibold hover:bg-unilag-light transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            Download Report
          </button>
          <button
            onClick={onStartOver}
            className="btn-unilag px-8 py-3 rounded-lg font-semibold shadow-lg flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
            </svg>
            Submit More Records
          </button>
        </div>

        {/* Success Message */}
        {report.failed === 0 && (
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600 italic">
              "All {report.total} records have been successfully submitted to your Google Form!"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
