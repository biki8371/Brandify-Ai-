import React, { useRef } from 'react';
import { TshirtIcon } from './TshirtIcon';

interface MockupGeneratorProps {
  logoUrl: string | null;
  onLogoUpload: (file: File) => void;
}

const MugMockup: React.FC<{ logoUrl: string | null }> = ({ logoUrl }) => (
  <div className="relative w-full aspect-square bg-slate-700 rounded-lg flex items-center justify-center p-4 overflow-hidden transition-all duration-300 hover:bg-slate-600/50">
    <div className="relative w-4/5 h-4/5">
      <div className="absolute inset-0 bg-white rounded-lg shadow-inner"></div>
      <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-10 h-24 border-8 border-white rounded-r-full"></div>
      {logoUrl && (
        <img
          src={logoUrl}
          alt="logo"
          className="absolute inset-0 w-1/2 h-1/2 object-contain m-auto"
        />
      )}
    </div>
    <span className="absolute bottom-3 right-4 text-xs font-semibold text-slate-400">Mug</span>
  </div>
);

const TshirtMockup: React.FC<{ logoUrl: string | null }> = ({ logoUrl }) => (
  <div className="relative w-full aspect-square bg-slate-700 rounded-lg flex items-center justify-center p-4 overflow-hidden transition-all duration-300 hover:bg-slate-600/50">
    <div className="relative w-full h-full text-slate-900">
      <TshirtIcon className="w-full h-full" />
      {logoUrl && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <img
            src={logoUrl}
            alt="logo"
            className="w-1/4 h-1/4 object-contain"
            style={{ marginTop: '-15%' }}
          />
        </div>
      )}
    </div>
     <span className="absolute bottom-3 right-4 text-xs font-semibold text-slate-400">T-Shirt</span>
  </div>
);

export const MockupGenerator: React.FC<MockupGeneratorProps> = ({ logoUrl, onLogoUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onLogoUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 h-full flex flex-col">
      <div className="flex-shrink-0 mb-6">
        <h2 className="text-2xl font-bold mb-2 text-cyan-300">Product Mockup Generator</h2>
        <p className="text-slate-400 mb-4">Upload your logo to see it on our products.</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/svg+xml"
          className="hidden"
        />
        <button
          onClick={handleButtonClick}
          className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          <span>{logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
        </button>
      </div>

      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-6">
        <MugMockup logoUrl={logoUrl} />
        <TshirtMockup logoUrl={logoUrl} />
      </div>
    </div>
  );
};
