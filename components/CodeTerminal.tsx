import React, { useState } from 'react';

interface CodeTerminalProps {
  language: string;
}

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);


export const CodeTerminal: React.FC<CodeTerminalProps> = ({ language }) => {
  const templates: Record<string, string> = {
    javascript: '// Type your JavaScript code here!\nconsole.log("Hello, Teacher!");',
    python: '# Python example\nprint("Hello, Teacher!")',
    java: '// Java example\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Teacher!");\n  }\n}',
    go: '// Go example\npackage main\nimport "fmt"\nfunc main(){ fmt.Println("Hello, Teacher!") }',
    rust: '// Rust example\nfn main(){ println!("Hello, Teacher!"); }',
    kotlin: '// Kotlin example\nfun main(){ println("Hello, Teacher!") }',
    typescript: '// TypeScript example\nconsole.log("Hello, Teacher!");',
  };

  const [code, setCode] = useState<string>(templates[language] || '// Type your code here...');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const getProxyBase = () => {
    const override = (globalThis as any).__VPT_PROXY_URL__;
    if (override) return override.replace(/\/$/, '');
    try { return window.location.origin.replace(/:\d+$/, ':4000'); } catch { return 'http://localhost:4000'; }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(prev => [...prev, `> Running ${language || 'code'}...`]);

    if (language === 'javascript') {
      // Run in-browser for JavaScript
      const newOutput: string[] = [];
      const originalConsoleLog = console.log;
      console.log = (...args: any[]) => {
        newOutput.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
      };
      try {
        new Function(code)();
      } catch (error) {
        if (error instanceof Error) newOutput.push(`Error: ${error.message}`);
        else newOutput.push('An unknown error occurred.');
      } finally {
        console.log = originalConsoleLog;
        setOutput(prev => [...prev, ...newOutput]);
        setIsRunning(false);
      }
      return;
    }

    // For other languages, POST to the server runner
    try {
      const base = getProxyBase();
      const res = await fetch(`${base}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code }),
      });
      if (!res.ok) {
        const errText = await res.text();
        setOutput(prev => [...prev, `Server error: ${res.status} ${errText}`]);
      } else {
        const json = await res.json();
        if (json.stdout) setOutput(prev => [...prev, ...String(json.stdout).split('\n')]);
  if (json.stderr) setOutput(prev => [...prev, ...String(json.stderr).split('\n').map((l: string) => `ERR: ${l}`)]);
        setOutput(prev => [...prev, `Exit code: ${json.exitCode}`, `Timed out: ${json.timedOut}`]);
      }
    } catch (err) {
      setOutput(prev => [...prev, `Execution request failed: ${String(err)}`]);
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleClearOutput = () => {
    setOutput([]);
  };

  // Provide the code playground for all languages. Execution is only supported
  // for JavaScript in the browser. For other languages, the editor is still
  // available so users can draft code and exercises; the Run button will be
  // disabled with a helpful message.
  const canExecute = language === 'javascript';

  return (
    <div className="mt-8 pt-6 border-t border-slate-700">
  <h3 className="text-xl font-bold text-white mb-4">{language ? `${language.charAt(0).toUpperCase() + language.slice(1)} Practice Terminal` : 'Code Practice Terminal'}</h3>
      <div className="bg-slate-900/70 rounded-lg shadow-inner overflow-hidden">
        {/* Editor */}
        <div className="p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-48 bg-transparent text-sky-300 font-mono text-sm resize-none focus:outline-none"
            placeholder={`// Your ${language || 'code'} goes here...`}
            spellCheck="false"
          />
        </div>

        {/* Controls */}
          <div className="p-2 flex justify-end items-center gap-2 bg-slate-800/50 border-t border-b border-slate-700">
           <button
             onClick={handleClearOutput}
             className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-md transition-colors"
           >
             <XCircleIcon />
             Clear Output
           </button>
          <button
            onClick={handleRunCode}
            disabled={!canExecute}
            title={!canExecute ? 'Execution supported only for JavaScript in the browser' : 'Run code'}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-md transition-colors ${canExecute ? 'text-primary bg-accent hover:bg-sky-400' : 'text-slate-400 bg-slate-700 cursor-not-allowed'}`}
          >
             <PlayIcon />
            {canExecute ? 'Run Code' : 'Run (JS only)'}
          </button>
        </div>

        {/* Output */}
        <div className="p-4 h-32 overflow-y-auto">
          <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap">
            {output.length > 0 ? output.map((line, index) => (
              <div key={index} className={`flex items-start ${line.toLowerCase().startsWith('error:') ? 'text-red-400' : ''}`}>
                  <span className="mr-2 text-slate-500 select-none">&gt;</span>
                  <span>{line}</span>
              </div>
            )) : <span className="text-slate-500">Output will appear here...</span>}
          </pre>
        </div>
      </div>
    </div>
  );
};
