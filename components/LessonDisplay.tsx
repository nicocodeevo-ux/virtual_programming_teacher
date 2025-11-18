import React from 'react';
import { CodeTerminal } from './CodeTerminal';
import { LANGUAGES } from '../data/lessons';

interface LessonDisplayProps {
  content: string;
  isLoading: boolean;
  languageKey?: string;
  topicTitle?: string;
  topic?: import('../types').LanguageTopic;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-6 bg-slate-700 rounded w-1/3"></div>
    <div className="space-y-3">
      <div className="h-4 bg-slate-700 rounded"></div>
      <div className="h-4 bg-slate-700 rounded w-5/6"></div>
    </div>
    <div className="h-24 bg-slate-700 rounded"></div>
    <div className="space-y-3">
      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
      <div className="h-4 bg-slate-700 rounded"></div>
    </div>
  </div>
);

const WelcomeMessage: React.FC = () => (
    <div className="text-center py-10">
      <div className="inline-block bg-secondary p-4 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Ready to Learn?</h2>
      <p className="text-slate-400">Select a language and topic above to start your first lesson.</p>
    </div>
);


export const LessonDisplay: React.FC<LessonDisplayProps> = ({ content, isLoading, languageKey, topicTitle, topic }) => {
  const languageName = languageKey ? LANGUAGES[languageKey]?.name : undefined;

  const renderContent = () => {
    // Basic markdown-like rendering for code blocks and bold text
    const parts = content.split(/(\`\`\`[\s\S]*?\`\`\`|\*\*[^\*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const code = part.replace(/```/g, '').trim();
        return (
          <pre key={index} className="bg-slate-900/70 rounded-lg p-4 my-4 overflow-x-auto">
            <code className="font-mono text-sky-300 text-sm">{code}</code>
          </pre>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-secondary/50 min-h-[400px] p-6 sm:p-8 rounded-xl shadow-lg border border-slate-700 transition-all duration-300">
      {isLoading ? <LoadingSkeleton /> :
       !content ? <WelcomeMessage /> : (
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{topicTitle}</h2>
          {languageName && <p className="text-accent font-medium mb-6">A lesson in {languageName}</p>}
          <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-li:text-slate-300 prose-headings:text-white whitespace-pre-wrap font-sans text-base leading-relaxed">
            {renderContent()}
          </div>
          {topic?.sourceUrl && (
            <div className="mt-4 text-sm">
              <a href={topic.sourceUrl} target="_blank" rel="noreferrer" className="text-sky-300">Source: {topic.sourceUrl}</a>
            </div>
          )}

          {topic?.interviewQuestions && topic.interviewQuestions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white mb-2">Interview Questions</h3>
              <ol className="list-decimal list-inside text-slate-300 space-y-1">
                {topic.interviewQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </div>
          )}

          {topic?.exercises && topic.exercises.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white mb-2">Exercises</h3>
              <ol className="list-decimal list-inside text-slate-300 space-y-1">
                {topic.exercises.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Interactive Code Terminal */}
          {languageKey && <CodeTerminal language={languageKey} />}

        </div>
      )}
    </div>
  );
};
