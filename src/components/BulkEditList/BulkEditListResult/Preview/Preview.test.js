import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
import { Preview } from './Preview';
import { queryClient } from '../../../../../test/jest/utils/queryClient';

jest.mock('./PreviewAccordion', () => ({
  PreviewAccordion: () => 'PreviewAccordion',
}));

const renderPreview = () => {
  render(
    <MemoryRouter initialEntries={['/bulk-edit/1?queryText=%28patronGroup%3D%3D"1"']}>
      <QueryClientProvider client={queryClient}>
        <Preview />,
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe('Preview', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            files: ['success.csv', 'error.csv'],
            progress: {
              progress: 55,
            },
          }),
        }),
      });
  });

  it('displays Bulk edit', () => {
    renderPreview();

    expect(screen.getByText(/preview.query.title/)).toBeVisible();
    expect(screen.getByText('PreviewAccordion')).toBeVisible();
  });
});
