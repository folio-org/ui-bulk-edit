import { useOkapiKy } from '@folio/stripes/core';

import { QueryClientProvider } from 'react-query';
import { render, screen, fireEvent } from '@testing-library/react';

import { MemoryRouter } from 'react-router';
import '../../../../test/jest/__mock__';
import { queryClient } from '../../../../test/jest/utils/queryClient';

import PreviewModal from './PreviewModal';

const startJob = jest.fn();
const inAppUpload = jest.fn().mockReturnValue(() => ({ response: { items: [] } }));
const refetch = jest.fn();

jest.doMock('../../../API', () => ({
  useLaunchJob: () => ({ startJob }),
  useInAppUpload: () => ({ inAppUpload, isLoading: false }),
  useInAppDownloadPreview: () => ({ data: [], refetch, isLoading: false }),
}));

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
        <PreviewModal
          open={open}
          jobId={jobId}
          contentUpdates={contentUpdates}
          onKeepEditing={onKeepEditing}
          onJobStarted={onJobStarted}
          setUpdatedId={setUpdatedId}
        />,
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

  it('should render PreviewModal correctly', () => {
    renderPreviewModal(props);

    expect(screen.getByText('ui-bulk-edit.previewModal.areYouSure')).toBeVisible();
    expect(screen.getByText('ui-bulk-edit.previewModal.message')).toBeVisible();
    expect(screen.getByText('ui-bulk-edit.previewModal.previewToBeChanged')).toBeVisible();

    // columns
    expect(screen.getByText('ui-bulk-edit.columns.barcode')).toBeVisible();
    expect(screen.getByText('ui-bulk-edit.columns.status')).toBeVisible();
    expect(screen.getByText('ui-bulk-edit.columns.effectiveLocation')).toBeVisible();
    expect(screen.getByText('ui-bulk-edit.columns.callNumber')).toBeVisible();
    expect(screen.getByText('ui-bulk-edit.columns.hrid')).toBeVisible();
    expect(screen.getByText('ui-bulk-edit.columns.materialType')).toBeVisible();
    expect(screen.getByText('ui-bulk-edit.columns.permanentLoanType')).toBeVisible();
    expect(screen.getByText('ui-bulk-edit.columns.temporaryLoanType')).toBeVisible();

    // buttons
    expect(screen.getByText('ui-bulk-edit.previewModal.keepEditing')).toBeVisible();
    expect(screen.getByText('ui-bulk-edit.previewModal.downloadPreview')).toBeVisible();
    expect(screen.getByText('ui-bulk-edit.previewModal.saveAndClose')).toBeVisible();
  });

  it('should call all footer handlers', async () => {
    renderPreviewModal(props);

    fireEvent.click(screen.getByText('ui-bulk-edit.previewModal.keepEditing'));
    expect(onKeepEditing).toHaveBeenCalled();
  });
});
