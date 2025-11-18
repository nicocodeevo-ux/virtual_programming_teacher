import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { LessonSelector } from './components/LessonSelector';
import { LessonDisplay } from './components/LessonDisplay';
import { Footer } from './components/Footer';
import { generateLesson } from './services/geminiService';
import { useEffect } from 'react';
import { loadLanguages, saveLanguages, resetLanguages } from './services/languagesService';
import type { LanguageTopic } from './types';
import { InterviewMode } from './components/InterviewMode';

const App: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [lessonContent, setLessonContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [languagesData, setLanguagesData] = useState<any>({});
  const [isInterviewOpen, setIsInterviewOpen] = useState<boolean>(false);

  const languages = Object.keys(languagesData);
  const topics = selectedLanguage ? languagesData[selectedLanguage]?.topics || [] : [];

  const handleGenerateLesson = useCallback(async () => {
    if (!selectedLanguage || !selectedTopic) {
      setError("Please select a language and a topic.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLessonContent('');

    try {
  const topicData = languagesData[selectedLanguage]?.topics.find((t: any) => t.title === selectedTopic);
      if (!topicData) {
        throw new Error("Selected topic not found.");
      }
      
      const content = await generateLesson(topicData.prompt);
      setLessonContent(content);
    } catch (err) {
      console.error(err);
      setError("Failed to generate lesson. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedLanguage, selectedTopic, languagesData]);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setSelectedTopic(''); // Reset topic when language changes
    setLessonContent('');
    setError(null);
  };

  useEffect(() => {
    const stored = loadLanguages();
    setLanguagesData(stored);
  }, []);

  const handleSaveLanguages = (updated: any) => {
    saveLanguages(updated);
    setLanguagesData(updated);
  };

  const handleResetLanguages = () => {
    const reset = resetLanguages();
    setLanguagesData(reset);
  };

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
  };

  const currentTopic = selectedLanguage ? languagesData[selectedLanguage]?.topics.find((t: any) => t.title === selectedTopic) : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary to-slate-900">
      <Header onToggleInterview={() => setIsInterviewOpen(v => !v)} interviewActive={isInterviewOpen} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-8">
          <LessonSelector
            languages={languages.map(l => languagesData[l]?.name)}
            selectedLanguage={languagesData[selectedLanguage]?.name || ''}
            onLanguageChange={(name) => {
                const langKey = Object.keys(languagesData).find(key => languagesData[key].name === name) || '';
                handleLanguageChange(langKey);
            }}
            topics={topics.map((t: LanguageTopic) => t.title)}
            selectedTopic={selectedTopic}
            onTopicChange={handleTopicChange}
            onSubmit={handleGenerateLesson}
            isLoading={isLoading}
          />
          {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">{error}</div>}
          <LessonDisplay
            content={lessonContent}
            isLoading={isLoading}
            languageKey={selectedLanguage}
            topicTitle={selectedTopic}
            topic={currentTopic}
          />
          {isInterviewOpen && (
            <InterviewMode
              data={languagesData}
              onSave={handleSaveLanguages}
              onReset={handleResetLanguages}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
