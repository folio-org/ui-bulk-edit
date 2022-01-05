import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';
import { QueryClient, QueryClientProvider } from 'react-query';

import '../../../test/jest/__mock__';

import BulkEditConformationModal from './BulkEditConformationModal';

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
      <BulkEditConformationModal
        open
        fileName={fileNameMock}
      />
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
