import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../test/jest/__mock__';

import BulkEditActionMenu from './BulkEditActionMenu';

const queryClient = new QueryClient();

const renderActionMenu = () => {
  window.history.pushState({}, 'Test page', '/bulk-edit/1');

  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <BulkEditActionMenu
          onEdit={jest.fn()}
          onDelete={jest.fn()}
          onToggle={jest.fn()}
        />
      </BrowserRouter>
    </QueryClientProvider>,

  );
};

describe('BulkEdit', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            files: [
              'donwloadMathcedRecords.com',
              'donwloadError.com',
            ],
          }),
        }),
      });
  });
  it('displays Bulk edit', async () => {
    renderActionMenu();

    const downloadButtons = [
      'download-link-matched',
      'download-link-error',
    ];

    await waitFor(() => downloadButtons.forEach((el) => expect(screen.getByTestId(el)).toBeVisible()));
  });
});
