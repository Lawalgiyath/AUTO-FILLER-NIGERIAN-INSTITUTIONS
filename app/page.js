'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import InstructionsModal from '@/components/InstructionsModal';
import UploadSection from '@/components/UploadSection';
import ResultsSection from '@/components/ResultsSection';

export default function Home() {
  const [hasReadInstructions, setHasReadInstructions] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [uploadResults, setUploadResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInstructionsConfirm = () => {
    setHasReadInstructions(true);
    setShowInstructions(false);
  };

  const handleFileUpload = async (file) => {
    setIsProcessing(true);
    setUploadResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/validate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadResults({
          success: true,
          data: data,
        });
      } else {
        setUploadResults({
          success: false,
          error: data.error || 'Validation failed',
        });
      }
    } catch (error) {
      setUploadResults({
        success: false,
        error: error.message || 'An error occurred while processing the file',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Card */}
        <div className="card-unilag p-8 mb-8 fade-in">
          <h2 className="text-3xl font-bold text-unilag-maroon mb-4">
            Welcome to UNILAG Staff Form AutoFiller
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            This system automates the process of submitting staff information to Google Forms. 
            Upload your staff data in CSV, Excel, or Word format, and we'll handle the rest.
          </p>
        </div>

        {/* Instructions Modal */}
        {showInstructions && (
          <InstructionsModal 
            onConfirm={handleInstructionsConfirm}
            onClose={() => setShowInstructions(false)}
          />
        )}

        {/* Show instructions button if already confirmed */}
        {hasReadInstructions && (
          <button
            onClick={() => setShowInstructions(true)}
            className="mb-6 text-unilag-maroon hover:text-unilag-dark underline font-semibold"
          >
            📖 View Instructions Again
          </button>
        )}

        {/* Upload Section */}
        <UploadSection
          hasReadInstructions={hasReadInstructions}
          onFileUpload={handleFileUpload}
          isProcessing={isProcessing}
        />

        {/* Results Section */}
        {uploadResults && (
          <ResultsSection results={uploadResults} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-unilag-maroon text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-2">
            University of Lagos Staff Form AutoFiller
          </p>
          <p className="text-sm opacity-90">
            Built with ❤️ for UNILAG | © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
