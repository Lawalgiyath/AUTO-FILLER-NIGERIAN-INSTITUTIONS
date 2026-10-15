'use client';

export default function CompletionReport({ report, onStartOver }) {
  const successRate = ((report.successful / report.total) * 100).toFixed(1);

  return (
    <div className="fade-in">
      <div className="card-unilag p-8 text-center">
        <div className="text-6xl mb-4">
          {report.failed === 0 ? '🎉' : '✅'}
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
              <span className="text-2xl mr-2">⚠️</span>
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
            <span className="text-2xl mr-2">📋</span>
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
            className="px-8 py-3 border-2 border-unilag-maroon text-unilag-maroon rounded-lg font-semibold hover:bg-unilag-light transition-colors"
          >
            📥 Download Report
          </button>
          <button
            onClick={onStartOver}
            className="btn-unilag px-8 py-3 rounded-lg font-semibold shadow-lg"
          >
            🔄 Submit More Records
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
