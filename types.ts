import type { FC, SVGProps } from 'react';

export interface LanguageTopic {
  title: string;
  prompt: string;
  // Optional interview questions that can also be converted to exercises
  interviewQuestions?: string[];
  // Optional exercises derived from the lesson or imported manually
  exercises?: string[];
  // If a topic was created by importing from a URL, preserve its source
  sourceUrl?: string;
}

export interface Language {
  name: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
  topics: LanguageTopic[];
}

export interface LanguagesData {
  [key: string]: Language;
}
