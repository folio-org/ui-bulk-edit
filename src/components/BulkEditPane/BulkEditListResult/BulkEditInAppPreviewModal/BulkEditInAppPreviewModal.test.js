import { QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router';

import {
  render,
  screen,
} from '@testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import '../../../../../test/jest/__mock__';
import { runAxeTest } from '@folio/stripes-testing';
import { bulkEditLogsData } from '../../../../../test/jest/__mock__/fakeData';
import { queryClient } from '../../../../../test/jest/utils/queryClient';
import { RootContext } from '../../../../context/RootContext';

import { JOB_STATUSES } from '../../../../constants';
import {
  useBulkOperationDetails,
  useRecordsPreview,
} from '../../../../hooks/api';
import { BulkEditPreviewModal } from './BulkEditPreviewModal';

jest.mock('../../../../hooks/api', () => ({
  ...jest.requireActual('../../../../hooks/api'),
  useBulkOperationDetails: jest.fn(),
  useRecordsPreview: jest.fn(),
}));

const bulkOperation = bulkEditLogsData[0];
const visibleColumns = [];
const setVisibleColumns = jest.fn();
const onKeepEditing = jest.fn();
const onPreviewSettled = jest.fn();

const defaultProps = {
  open: true,
  onKeepEditing,
  onPreviewSettled,
  isJobPreparing: false,
  isPreviewSettled: false,
  modalFooter: <div>Footer</div>,
};

const renderPreviewModal = (props = defaultProps, fileName = 'barcodes.csv') => {
  return render(
    <MemoryRouter initialEntries={[`/bulk-edit/1/initial?capabilities=ITEMS&fileName=${fileName}&identifier=BARCODE`]}>
      <QueryClientProvider client={queryClient}>
        <RootContext.Provider value={{
          visibleColumns,
          setVisibleColumns,
        }}
        >
          <BulkEditPreviewModal {...props} />
        </RootContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

const getJsonMock = jest.fn().mockReturnValue({});

describe('BulkEditInAppPreviewModal', () => {
  beforeEach(() => {
    useBulkOperationDetails.mockClear().mockReturnValue({
      bulkDetails: bulkOperation,
    });

    useRecordsPreview.mockClear().mockReturnValue({
      isLoading: false,
      refetch: jest.fn(),
      isFetching: false,
      contentData: [],
      columnMapping: {},
      columns: [],
    });

    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: getJsonMock,
        }),
        post: () => ({
          json: () => ({}),
        }),
      });
  });

  it('should render spinner if isJobPreparing set to true', async () => {
    await renderPreviewModal({ ...defaultProps, isJobPreparing: true });

    expect(screen.getByTestId('preloader')).toBeInTheDocument();
  });

  it('should display preview records when available', async () => {
    const uuidColumn = {
      value: 'uuid',
      label: 'uuid',
      visible: true,
      dataType: 'string',
    };

    getJsonMock.mockClear().mockReturnValue({
      // preview data
      header: [uuidColumn],
      rows: [{ row: ['uuid'] }],
      // bulk operation data
      status: JOB_STATUSES.REVIEW_CHANGES,
    });

    await renderPreviewModal();

    expect(screen.getByText('ui-bulk-edit.previewModal.previewToBeChanged')).toBeInTheDocument();

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should display footer if provided', async () => {
    await renderPreviewModal();

    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
