import { render, screen } from '@testing-library/react';
import React from 'react';
import { ProgressBar } from './ProgressBar';

const renderProgressBar = (props) => {
  render(<ProgressBar {...props} />);
};


describe('ProgressBar', () => {
  const props = {
    title: 'title',
    progress: 10,
  };

  it('should display correct title', async () => {
    renderProgressBar(props);

    const title = await screen.findByText(props.title);

    expect(title).toBeVisible();
  });

  it('should display correct width percentage', async () => {
    renderProgressBar(props);

    const progressLine = await screen.findByTestId('progress-line');

    expect(progressLine).toBeVisible();
    expect(progressLine.getAttribute('style')).toBe(`width: ${props.progress}%;`);
  });
});
