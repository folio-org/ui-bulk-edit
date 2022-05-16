import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../../../test/jest/__mock__';

import { QueryClientProvider } from 'react-query';
import { Preview } from './Preview';
import { queryClient } from '../../../../../test/jest/utils/queryClient';
import { RootContext } from '../../../../context/RootContext';

jest.mock('./PreviewAccordion', () => ({
  PreviewAccordion: () => 'PreviewAccordion',
}));

const renderPreview = ({ title, initial }) => {
  render(
    <MemoryRouter initialEntries={['/bulk-edit/1?queryText=patronGroup%3D%3D"1"']}>
      <QueryClientProvider client={queryClient}>
        <RootContext.Provider value={{ setNewBulkFooterShown: jest.fn() }}>
          <Preview title={title} id="1" initial={initial} />
        </RootContext.Provider>
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
    renderPreview({ title: 'preview.query.title' });

    expect(screen.getByText(/preview.query.title/)).toBeVisible();
  });

  it('displays Bulk edit', () => {
    renderPreview({ title: 'preview.query.title', initial: true });

    expect(screen.getByText(/preview.query.title/)).toBeVisible();
  });
});
