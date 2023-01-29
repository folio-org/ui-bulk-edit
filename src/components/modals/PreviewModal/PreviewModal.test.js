import { useOkapiKy } from '@folio/stripes/core';

import { QueryClientProvider } from 'react-query';
import { render, screen, fireEvent } from '@testing-library/react';

import { MemoryRouter } from 'react-router';
import '../../../../test/jest/__mock__';
import { queryClient } from '../../../../test/jest/utils/queryClient';
import { RootContext } from '../../../context/RootContext';

import PreviewModal from './PreviewModal';
import { getInventoryResultsFormatterBase } from '../../../utills/formatters';

const startJob = jest.fn();
const inAppUpload = jest.fn().mockReturnValue(() => ({ response: { items: [] } }));
const refetch = jest.fn();

jest.doMock('../../../API', () => ({
  useLaunchJob: () => ({ startJob }),
  useInAppUpload: () => ({ inAppUpload, isLoading: false }),
  useInAppDownloadPreview: () => ({ data: [], refetch, isLoading: false }),
}));

const visibleColumns = JSON.stringify(Object.keys(getInventoryResultsFormatterBase()));

const renderPreviewModal = ({
  open,
  jobId,
  contentUpdates = [],
  onKeepEditing,
  onJobStarted,
  setUpdatedId,
}) => {
  render(
    <MemoryRouter initialEntries={['/bulk-edit/1/initial?capabilities=ITEMS&fileName=barcodes.csv&identifier=BARCODE']}>
      <QueryClientProvider client={queryClient}>
        <RootContext.Provider value={{
          visibleColumns,
        }}
        >
          <PreviewModal
            open={open}
            jobId={jobId}
            contentUpdates={contentUpdates}
            onKeepEditing={onKeepEditing}
            onJobStarted={onJobStarted}
            setUpdatedId={setUpdatedId}
          />,
        </RootContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

const onKeepEditing = jest.fn();
const onJobStarted = jest.fn();
const setUpdatedId = jest.fn();

const props = {
  open: true,
  jobId: '1',
  contentUpdates: [],
  onKeepEditing,
  onJobStarted,
  setUpdatedId,
};

describe('PreviewModal', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ([]),
        }),
        post: () => ({
          json: () => ({}),
        }),
      });
  });

  it('should call all footer handlers', async () => {
    renderPreviewModal(props);

    fireEvent.click(screen.getByText('ui-bulk-edit.previewModal.keepEditing'));
    expect(onKeepEditing).toHaveBeenCalled();
  });
});
