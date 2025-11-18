import React from 'react';
import { render, screen } from '@testing-library/react';
import { LessonDisplay } from '../components/LessonDisplay';

describe('LessonDisplay', () => {
  test('renders content and topic extras', () => {
    const topic = {
      title: 'T1',
      prompt: 'p',
      interviewQuestions: ['Q1', 'Q2'],
      exercises: ['E1']
    } as any;
    render(<LessonDisplay content={'Hello **World**'} isLoading={false} languageKey={'javascript'} topicTitle={'T1'} topic={topic} />);
    expect(screen.getByText('T1')).toBeInTheDocument();
    expect(screen.getByText('Interview Questions')).toBeInTheDocument();
    expect(screen.getByText('Exercises')).toBeInTheDocument();
  });
});
