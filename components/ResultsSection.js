'use client';

export default function ResultsSection({ results }) {
  if (!results) return null;

  if (!results.success) {
    return (
      <div className="card-unilag p-8 mt-8 fade-in border-red-500">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-bold text-red-600 mb-4">
            Validation Failed
          </h3>
          <p className="text-gray-700 text-lg">
            {results.error}
          </p>
        </div>
      </div>
    );
  }

  const { summary, results: validationResults } = results.data;

  return (
    <div className="mt-8 space-y-6 fade-in">
      {/* Summary Card */}
      <div className="card-unilag p-8">
        <h3 className="text-2xl font-bold text-unilag-maroon mb-6 flex items-center">
          <span className="text-3xl mr-3">📊</span>
          Validation Results
        </h3>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-blue-600">{summary.total}</p>
            <p className="text-sm text-gray-600">Total Records</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-green-600">{summary.valid}</p>
            <p className="text-sm text-gray-600">Valid</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-red-600">{summary.invalid}</p>
            <p className="text-sm text-gray-600">Invalid</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-yellow-600">{summary.warnings}</p>
            <p className="text-sm text-gray-600">Warnings</p>
          </div>
        </div>

        {summary.valid === summary.total ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-green-800 font-semibold flex items-center">
              <span className="text-2xl mr-2">✅</span>
              All records are valid and ready for processing!
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-yellow-800 font-semibold">
              ⚠️ Some records have issues. Please review below.
            </p>
          </div>
        )}
      </div>

      {/* Detailed Results */}
      {validationResults && validationResults.some(r => !r.valid || r.warnings.length > 0) && (
        <div className="card-unilag p-8">
          <h4 className="text-xl font-bold text-unilag-maroon mb-4">
            Detailed Validation Report
          </h4>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {validationResults.map((result, index) => {
              if (result.valid && result.warnings.length === 0) return null;
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.valid
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Record #{result.recordNumber}: {result.record.firstName} {result.record.surname}
                      </p>
                      <p className="text-sm text-gray-600">
                        {result.record.email}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      result.valid
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {result.valid ? 'Warning' : 'Error'}
                    </span>
                  </div>

                  {result.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-semibold text-red-700 mb-1">Errors:</p>
                      <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                        {result.errors.map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.warnings.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-semibold text-yellow-700 mb-1">Warnings:</p>
                      <ul className="list-disc list-inside text-sm text-yellow-600 space-y-1">
                        {result.warnings.map((warning, i) => (
                          <li key={i}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Valid Records Preview */}
      {summary.valid > 0 && (
        <div className="card-unilag p-8">
          <h4 className="text-xl font-bold text-unilag-maroon mb-4">
            ✅ Valid Records ({summary.valid})
          </h4>
          <p className="text-gray-600 mb-4">
            These records passed all validation checks and are ready for submission.
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-unilag-maroon text-white">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Rank</th>
                </tr>
              </thead>
              <tbody>
                {validationResults
                  .filter(r => r.valid)
                  .slice(0, 10)
                  .map((result, index) => (
                    <tr key={index} className="border-b hover:bg-unilag-light">
                      <td className="px-4 py-2">{result.recordNumber}</td>
                      <td className="px-4 py-2 font-semibold">
                        {result.record.title} {result.record.firstName} {result.record.surname}
                      </td>
                      <td className="px-4 py-2 text-gray-600">{result.record.email}</td>
                      <td className="px-4 py-2">{result.record.department}</td>
                      <td className="px-4 py-2">{result.record.rank}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {summary.valid > 10 && (
              <p className="text-center text-gray-500 mt-4">
                ... and {summary.valid - 10} more valid records
              </p>
            )}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {summary.valid > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h4 className="text-lg font-bold text-blue-800 mb-2">
            📝 Next Steps
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Review the validation results above</li>
            <li>Fix any errors in your data file if needed</li>
            <li>Configure your Google Form URL in the system</li>
            <li>Run the form filler with your validated data</li>
          </ol>
        </div>
      )}
    </div>
  );
}
