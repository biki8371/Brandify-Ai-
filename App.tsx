import React, { useState } from 'react';
import { Header } from './components/Header';
import { MockupGenerator } from './components/MockupGenerator';
import { Chatbot } from './components/Chatbot';

const App: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
          <div className="lg:col-span-3">
            <MockupGenerator logoUrl={logoUrl} onLogoUpload={handleLogoUpload} />
          </div>
          <div className="lg:col-span-2 flex flex-col h-[75vh] lg:h-auto">
            <Chatbot />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
