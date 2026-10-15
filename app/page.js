'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import FormUrlInput from '@/components/FormUrlInput';
import FieldMapping from '@/components/FieldMapping';
import InstructionsModal from '@/components/InstructionsModal';
import UploadAndSubmit from '@/components/UploadAndSubmit';
import ProgressTracker from '@/components/ProgressTracker';
import CompletionReport from '@/components/CompletionReport';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formUrl, setFormUrl] = useState('');
  const [detectedFields, setDetectedFields] = useState(null);
  const [fieldMapping, setFieldMapping] = useState(null);
  const [hasReadInstructions, setHasReadInstructions] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);
  const [submissionProgress, setSubmissionProgress] = useState(null);
  const [completionReport, setCompletionReport] = useState(null);

  const handleFormAnalyzed = (url, fields) => {
    setFormUrl(url);
    setDetectedFields(fields);
    setCurrentStep(2);
  };

  const handleMappingComplete = (mapping) => {
    setFieldMapping(mapping);
    setShowInstructions(true); // Show instructions before upload
  };

  const handleInstructionsConfirmed = () => {
    setHasReadInstructions(true);
    setShowInstructions(false);
    setCurrentStep(3); // Move to upload step
  };

  const handleDataUploaded = (data) => {
    setUploadedData(data);
    // Show preview and confirm before submission
  };

  const handleStartSubmission = async () => {
    setCurrentStep(4); // Move to progress tracking
    // Start submission process
  };

  const handleSubmissionComplete = (report) => {
    setCompletionReport(report);
    setCurrentStep(5);
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setFormUrl('');
    setDetectedFields(null);
    setFieldMapping(null);
    setHasReadInstructions(false);
    setUploadedData(null);
    setSubmissionProgress(null);
    setCompletionReport(null);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Steps Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { num: 1, label: 'Form URL' },
              { num: 2, label: 'Map Fields' },
              { num: 3, label: 'Upload Data' },
              { num: 4, label: 'Submit' },
              { num: 5, label: 'Complete' }
            ].map((step) => (
              <div key={step.num} className="flex items-center">
                <div className={`flex flex-col items-center ${
                  currentStep >= step.num ? 'opacity-100' : 'opacity-40'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step.num 
                      ? 'bg-unilag-maroon text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {currentStep > step.num ? '✓' : step.num}
                  </div>
                  <p className="text-xs mt-1 font-semibold">{step.label}</p>
                </div>
                {step.num < 5 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.num ? 'bg-unilag-maroon' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Form URL Input */}
        {currentStep === 1 && (
          <FormUrlInput onFormAnalyzed={handleFormAnalyzed} />
        )}

        {/* Step 2: Field Mapping */}
        {currentStep === 2 && detectedFields && (
          <FieldMapping
            detectedFields={detectedFields}
            onMappingComplete={handleMappingComplete}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {/* Instructions Modal (Before Upload) */}
        {showInstructions && (
          <InstructionsModal
            onConfirm={handleInstructionsConfirmed}
            onClose={() => setShowInstructions(false)}
            fieldMapping={fieldMapping}
          />
        )}

        {/* Step 3: Upload and Submit */}
        {currentStep === 3 && hasReadInstructions && (
          <UploadAndSubmit
            fieldMapping={fieldMapping}
            formUrl={formUrl}
            onDataUploaded={handleDataUploaded}
            onStartSubmission={handleStartSubmission}
            onBack={() => setCurrentStep(2)}
            onShowInstructions={() => setShowInstructions(true)}
          />
        )}

        {/* Step 4: Progress Tracking */}
        {currentStep === 4 && (
          <ProgressTracker
            uploadedData={uploadedData}
            fieldMapping={fieldMapping}
            formUrl={formUrl}
            onComplete={handleSubmissionComplete}
          />
        )}

        {/* Step 5: Completion Report */}
        {currentStep === 5 && completionReport && (
          <CompletionReport
            report={completionReport}
            onStartOver={handleStartOver}
          />
        )}
      </main>

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
