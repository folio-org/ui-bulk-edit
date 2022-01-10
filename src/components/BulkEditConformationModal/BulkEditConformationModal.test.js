import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { useOkapiKy } from '@folio/stripes/core';
import { createMemoryHistory } from 'history';
import { QueryClient, QueryClientProvider } from 'react-query';

import '../../../test/jest/__mock__';

import BulkEditConformationModal from './BulkEditConformationModal';

const history = createMemoryHistory();

const fileNameMock = 'test.csv';

const renderBulkEditConformationModal = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter history={history}>
        <BulkEditConformationModal
          open
          fileName={fileNameMock}
        />
      </BrowserRouter>
    </QueryClientProvider>,
  );
};

describe('BulkEditActionMenu', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        post: () => ({
        }),
      });
  });
  it('should displays BulkEditConformationModal title', async () => {
    renderBulkEditConformationModal();

    expect(screen.getByText(/title.conformationModal/)).toBeVisible();
  });

  it('should displays BulkEditConformationModal content message', async () => {
    renderBulkEditConformationModal();

    expect(screen.getByText(/conformationModal.message/)).toBeVisible();
  });

  it('should displays BulkEditConformationModal buttons', async () => {
    renderBulkEditConformationModal();

    const buttons = [
      /stripes-components.saveAndClose/,
      /stripes-components.cancel/,
    ];

    buttons.forEach((el) => expect(screen.getByRole('button', { name: el })).toBeEnabled());
  });

  it('should call onCancel callback', async () => {
    renderBulkEditConformationModal();

    userEvent.click(screen.getByRole('button', { name: /stripes-components.cancel/ }));
  });

  it('should call onStart callback', async () => {
    renderBulkEditConformationModal();

    userEvent.click(screen.getByRole('button', { name: /stripes-components.saveAndClose/ }));
  });
});
