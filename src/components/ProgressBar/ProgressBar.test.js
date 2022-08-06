import { render, screen } from '@testing-library/react';
import React from 'react';
import { useOkapiKy } from '@folio/stripes/core';
import { QueryClientProvider } from 'react-query';
import { createMemoryHistory } from 'history';
import { MemoryRouter } from 'react-router';
import { ProgressBar } from './ProgressBar';
import { queryClient } from '../../../test/jest/utils/queryClient';
import { JOB_STATUSES } from '../../constants';

const history = createMemoryHistory();

const renderProgressBar = (props) => {
  render(
    <MemoryRouter initialEntries={['/bulk-edit/1/progress?processedFileName=some.scv']}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar {...props} />
      </QueryClientProvider>
    </MemoryRouter>,
  );
};


describe('ProgressBar', () => {
  const progress = 55;
  const props = {
    title: 'title',
    updatedId: '1',
  };

  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            progress: {
              progress,
            },
            status: JOB_STATUSES.SUCCESSFUL,
          }),
        }),
      });
  });

  it('should display correct title', async () => {
    history.push({
      search: '?fileName=Mock.csv',
    });

    renderProgressBar(props);

    const title = await screen.findByText(/progressBar.title/);

    expect(title).toBeVisible();
  });

  it('should display correct width percentage', async () => {
    history.push({
      search: '?processedFileName=Mock.csv',
    });

    renderProgressBar(props);

    const progressLine = await screen.findByTestId('progress-line');

    expect(progressLine).toBeVisible();
    expect(progressLine.getAttribute('style')).toBe(`width: ${progress}%;`);
  });
});
