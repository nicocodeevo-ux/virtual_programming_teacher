import React from 'react';
import { render, screen } from '@testing-library/react';
import { InterviewMode } from '../components/InterviewMode';

describe('InterviewMode', () => {
  test('renders editor and buttons', () => {
    const data = { javascript: { name: 'JavaScript', topics: [] } };
    render(<InterviewMode data={data} onSave={() => {}} onReset={() => {}} />);
    expect(screen.getByText('Interview Mode — Edit Languages & Lessons')).toBeInTheDocument();
    expect(screen.getByText('Export JSON')).toBeInTheDocument();
  });
});
