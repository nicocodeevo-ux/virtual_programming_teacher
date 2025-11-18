
import React from 'react';

const BrainCircuitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a10 10 0 0 0-3.54 19.54" />
    <path d="M12 22a10 10 0 0 0 3.54-19.54" />
    <path d="M4 12H2" />
    <path d="M22 12h-2" />
    <path d="M12 4V2" />
    <path d="M12 22v-2" />
    <path d="m4.93 4.93-.01.01" />
    <path d="m19.07 19.07-.01.01" />
    <path d="m4.93 19.07-.01-.01" />
    <path d="m19.07 4.93-.01-.01" />
    <path d="M12 12a5 5 0 0 0-5 5" />
    <path d="M17 12a5 5 0 0 1-5 5" />
    <path d="M12 12a5 5 0 0 1 5-5" />
    <path d="M7 12a5 5 0 0 0 5-5" />
  </svg>
);


interface HeaderProps {
  onToggleInterview?: () => void;
  interviewActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleInterview, interviewActive = false }) => {
  return (
    <header className="py-6 bg-primary/80 backdrop-blur-sm border-b border-secondary">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <BrainCircuitIcon className="h-8 w-8 text-accent mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100">
            Virtual Programming Teacher
          </h1>
        </div>
        <div>
          <button onClick={onToggleInterview} className={`px-3 py-2 rounded ${interviewActive ? 'bg-accent text-primary' : 'bg-slate-700 text-slate-200'}`}>
            {interviewActive ? 'Close Interview' : 'Open Interview'}
          </button>
        </div>
      </div>
    </header>
  );
};
