import React from 'react';
import { render, screen, logDOM, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../test/jest/__mock__';

import { queryClient } from '../../../test/jest/utils/queryClient';
import BulkEdit from '../BulkEdit';

jest.mock('../../API', () => ({
  useLaunchJob: () => ({ startJob: jest.fn(() => Promise.resolve({ data: {} })) }),
  useFileUploadComand: () => ({ fileUpload: jest.fn() }),
  useJobCommand: () => ({ requestJobId: '1', isLoading: false }),
  useUserGroupsMap: () => ({ data: {} }),
  useDownloadLinks: () => ({
    data: {
      files: ['file1.csv', 'file2.csv'],
    },
    isLoading: false,
    refetch: jest.fn(),
  }),
  usePreviewRecords: () => ({
    items: [],
  }),
  useErrorsList: () => ({ errors: [{ message: 'errorID ,errorMessage' }] }),
}));

const setQueryData = jest.fn();

jest.doMock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQueryClient: () => ({
    setQueryData,
  }),
}));


const renderBulkEdit = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/bulk-edit/1/initial?capabilities=ITEMS&fileName=barcodes.csv&identifier=BARCODE']}>2
        <BulkEdit />
      </MemoryRouter>,
    </QueryClientProvider>,
  );
};

describe('BulkEdit', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        post: () => ({
          json: () => ({
            id: '1',
          }),
        }),
      });
  });

  it('displays New bulk edit button, if errors or preview are present', async () => {
    renderBulkEdit();

    const errrorID = await screen.findByText(/errorID/);
    const errorMessage = await screen.findByText(/errorMessage/);

    expect(errrorID).toBeVisible();
    expect(errorMessage).toBeVisible();

    const newBulkEditBtn = await screen.findByText(/ui-bulk-edit.start.newBulkEdit/);

    expect(newBulkEditBtn).toBeVisible();
  });

  it('should call handler if clicked on New bulk edit button', async () => {
    renderBulkEdit();

    const newBulkEditBtn = await screen.findByText(/ui-bulk-edit.start.newBulkEdit/);

    expect(newBulkEditBtn).toBeVisible();

    userEvent.click(newBulkEditBtn);

    waitFor(() => {
      expect(setQueryData).toHaveBeenCalled();
    });
  });
});
