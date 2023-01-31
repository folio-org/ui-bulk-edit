import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { QueryClientProvider } from 'react-query';

import '../../../../../test/jest/__mock__';

import { BrowserRouter } from 'react-router-dom';
import { BulkEditManualUploadModal } from './index';
import { mockData, createDtWithFiles, createFile, flushPromises, dispatchEvt } from '../../../../../test/jest/utils/fileUpload';
import { queryClient } from '../../../../../test/jest/utils/queryClient';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/test.csv?capabilities=USERS',
  }),
}));

const onCancelMock = jest.fn();
const setIsBulkEditModalOpen = jest.fn();
const setFileNameMock = jest.fn();

const file = 'file.csv';

const currentRoute = `/bulk-edit/1/preview?capabilities=ITEMS&processedFileName=${file}`;

const renderWithRouter = (ui, { route } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(ui, { wrapper: BrowserRouter });
};

const startModal = (
  <QueryClientProvider client={queryClient}>
    <BulkEditManualUploadModal
      open
      onCancel={onCancelMock}
      setFileName={setFileNameMock}
      setIsBulkEditModalOpen={setIsBulkEditModalOpen}
    />
  </QueryClientProvider>
);

describe('BulkEditActionMenu', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        post: () => ({
        }),
      });
  });
  it('should displays BulkEditManualConformationModal title', async () => {
    renderWithRouter(startModal, { route: currentRoute });

    expect(screen.getByText(/meta.title/)).toBeVisible();
  });

  it('should update title with uploaded name', async () => {
    const fileData = [createFile('SearchHoldings.csv', 1111, 'application/csv')];

    const event = createDtWithFiles(fileData);
    const data = mockData([fileData]);

    renderWithRouter(startModal, { route: currentRoute });

    const fileInput = screen.getByTestId('fileUploader-input');

    dispatchEvt(fileInput, 'dragenter', data);
    await flushPromises();

    fireEvent.drop(fileInput, event);
    await flushPromises();
  });

  it('should call cancel handler', async () => {
    renderWithRouter(startModal);

    expect(window.location.search).toContain('processedFileName');

    const cancelButton = screen.getByText(/stripes-components.cancel/i);

    fireEvent.click(cancelButton);

    expect(onCancelMock).toHaveBeenCalled();
  });
});
