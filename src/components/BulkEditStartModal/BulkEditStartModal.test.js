import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { QueryClientProvider } from 'react-query';

import '../../../test/jest/__mock__';

import { BulkEditStartModal } from '.';
import { mockData, createDtWithFiles, createFile, flushPromises, dispatchEvt } from '../../../test/jest/utils/fileUpload';
import { queryClient } from '../../../test/jest/utils/queryClient';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/test.csv',
  }),
}));

const openMock = jest.fn();

const onCancelMock = jest.fn();

const setFileNameMock = jest.fn();

const renderStartModal = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <BulkEditStartModal
        open={openMock}
        onCancel={onCancelMock}
        setFileName={setFileNameMock}
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
    renderStartModal();

    expect(screen.getByText(/meta.title/)).toBeVisible();
  });

  it('should update title with uploaded name', async () => {
    const file = [createFile('SearchHoldings.csv', 1111, 'application/csv')];

    const event = createDtWithFiles(file);
    const data = mockData([file]);

    renderStartModal();

    const fileInput = screen.getByTestId('fileUploader-input');

    dispatchEvt(fileInput, 'dragenter', data);
    await flushPromises();

    fireEvent.drop(fileInput, event);
    await flushPromises();
  });
});
