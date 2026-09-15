import React, { useState, useEffect, useCallback } from 'react';
import {
  UploadSimple,
  Camera,
  MagnifyingGlass,
  CircleNotch,
  Key,
  Warning,
} from '@phosphor-icons/react';

import Header from './components/Header';
import Hero from './components/Hero';
import ImageUploadZone from './components/ImageUploadZone';
import CameraModal from './components/CameraModal';
import ResultsPanel from './components/ResultsPanel';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import Footer from './components/Footer';
import Toast from './components/Toast';

import { useCamera } from './hooks/useCamera';
import { useDetection } from './hooks/useDetection';
import { checkBackendHealth } from './lib/api';

export default function App() {
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [backendStatus, setBackendStatus] = useState({
    checked: false,
    online: false,
    roboflowConfigured: false,
  });

  const camera = useCamera();
  const detection = useDetection();

  // Show a floating toast message
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  // Check backend server and API key status on mount
  useEffect(() => {
    async function verifyBackend() {
      const health = await checkBackendHealth();
      setBackendStatus({
        checked: true,
        online: health.status === 'ok',
        roboflowConfigured: Boolean(health.roboflowConfigured),
      });
    }
    verifyBackend();
  }, []);

  // Handle image selected from gallery or drag-drop
  const handleImageSelected = useCallback((dataUrl) => {
    setImagePreview(dataUrl);
    detection.reset();
  }, [detection]);

  // Clear current image and reset results
  const handleClearImage = useCallback(() => {
    setImagePreview(null);
    detection.reset();
  }, [detection]);

  // Open camera viewfinder
  const handleOpenCamera = useCallback(async () => {
    try {
      await camera.open();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, [camera, showToast]);

  // Capture photo from camera
  const handleCapturePhoto = useCallback(() => {
    try {
      const capturedDataUrl = camera.capture();
      setImagePreview(capturedDataUrl);
      detection.reset();
      showToast('Photo captured successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, [camera, detection, showToast]);

  // Run AI identification
  const handleRunDetection = useCallback(async () => {
    if (!imagePreview) {
      showToast('Please upload an image or capture a photo first.', 'info');
      return;
    }

    try {
      await detection.run(imagePreview);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, [imagePreview, detection, showToast]);

  return (
    <div className="min-h-screen flex flex-col bg-herb-50 font-sans text-gray-800">
      {/* Top Navbar */}
      <Header backendConfigured={backendStatus.roboflowConfigured} />

      {/* Hero Banner */}
      <Hero />

      {/* Main Detection Workspace */}
      <main id="detect" className="flex-1 max-w-4xl w-full mx-auto px-4 -mt-6 sm:-mt-8 z-10">
        {/* Backend Configuration Notice (if API key not added yet in backend/.env) */}
        {backendStatus.checked && (!backendStatus.online || !backendStatus.roboflowConfigured) && (
          <div className="mb-4 bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-amber-200 flex items-start gap-3 text-xs sm:text-sm text-amber-900">
            <Warning size={22} className="text-amber-600 shrink-0 mt-0.5" weight="fill" />
            <div className="space-y-1">
              <span className="font-bold block text-amber-950">
                {!backendStatus.online
                  ? 'Backend Server Not Detected'
                  : 'Roboflow API Key Required in backend/.env'}
              </span>
              <p className="text-amber-800 text-xs leading-relaxed">
                {!backendStatus.online ? (
                  <>
                    Please start the backend server in the <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">backend/</code> directory with <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">npm run dev</code>.
                  </>
                ) : (
                  <>
                    Open <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">backend/.env</code> and set your <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">ROBOFLOW_API_KEY</code>. Get your key from{' '}
                    <a
                      href="https://app.roboflow.com/settings/api"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold text-amber-950"
                    >
                      app.roboflow.com/settings/api
                    </a>.
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Primary Interactive Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-float border border-herb-100 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              Scan Medicinal Plant
            </h2>
            <span className="text-xs font-semibold text-herb-700 bg-herb-100 px-3 py-1 rounded-full">
              Mobile First
            </span>
          </div>

          {/* Upload Dropzone & Image Preview */}
          <ImageUploadZone
            imagePreview={imagePreview}
            onImageSelected={handleImageSelected}
            onClear={handleClearImage}
          />

          {/* Dual Action Buttons: Upload from File & Direct Camera Capture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Upload Button */}
            <label
              htmlFor="upload-btn-input"
              className="flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-2xl bg-white border-2 border-herb-600 text-herb-700 hover:bg-herb-50 font-bold text-sm cursor-pointer transition-colors active:scale-98 text-center shadow-soft"
            >
              <UploadSimple size={20} weight="bold" />
              <span>Choose from Gallery</span>
            </label>
            <input
              id="upload-btn-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => handleImageSelected(ev.target.result);
                  reader.readAsDataURL(file);
                }
              }}
            />

            {/* Direct Camera Button */}
            <button
              type="button"
              onClick={handleOpenCamera}
              className="flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-2xl bg-accent-600 hover:bg-accent-700 active:scale-98 text-white font-bold text-sm transition-colors shadow-soft"
            >
              <Camera size={20} weight="bold" />
              <span>Open Camera</span>
            </button>
          </div>

          {/* Identify Button */}
          <button
            type="button"
            onClick={handleRunDetection}
            disabled={!imagePreview || detection.isLoading}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-herb-700 hover:bg-herb-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg shadow-herb-900/15 transition-all active:scale-[0.99]"
          >
            {detection.isLoading ? (
              <>
                <CircleNotch size={22} className="animate-spin" />
                <span>Analyzing Plant with Roboflow AI...</span>
              </>
            ) : (
              <>
                <MagnifyingGlass size={22} weight="bold" />
                <span>Identify Medicinal Plant</span>
              </>
            )}
          </button>

          {/* Error Message Display */}
          {detection.isError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm space-y-2 animate-fade-in">
              <div className="font-bold flex items-center gap-1.5 text-red-900">
                <Warning size={18} weight="fill" className="text-red-600" />
                <span>Identification Error</span>
              </div>
              <p className="leading-relaxed">{detection.error}</p>
              <button
                type="button"
                onClick={handleRunDetection}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-red-950 underline hover:no-underline"
              >
                Retry Identification
              </button>
            </div>
          )}
        </div>

        {/* Results Panel */}
        {detection.isSuccess && (
          <ResultsPanel
            predictions={detection.predictions}
            imagePreview={imagePreview}
            onReset={handleClearImage}
          />
        )}

        {/* Educational Content Sections */}
        <HowItWorks />
        <About />
      </main>

      {/* Footer */}
      <Footer />

      {/* Fullscreen Camera Modal */}
      <CameraModal
        isOpen={camera.isOpen}
        videoRef={camera.videoRef}
        onCapture={handleCapturePhoto}
        onClose={camera.close}
        error={camera.error}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

