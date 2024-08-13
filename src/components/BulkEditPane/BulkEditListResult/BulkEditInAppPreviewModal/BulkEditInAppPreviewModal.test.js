import { QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router';

import {
  act,
  render,
  screen,
  fireEvent
} from '@testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import '../../../../../test/jest/__mock__';
import { runAxeTest } from '@folio/stripes-testing';
import { bulkEditLogsData } from '../../../../../test/jest/__mock__/fakeData';
import { queryClient } from '../../../../../test/jest/utils/queryClient';
import { RootContext } from '../../../../context/RootContext';

import {
  ACTIONS,
  OPTIONS,
  JOB_STATUSES,
} from '../../../../constants';
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
const onChangesCommited = jest.fn();

const defaultProps = {
  open: true,
  bulkOperationId: bulkOperation.id.toString(),
  onKeepEditing,
  onChangesCommited,
  contentUpdates: undefined,
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

  it('should call all footer handlers', () => {
    renderPreviewModal();

    fireEvent.click(screen.getByText('ui-bulk-edit.previewModal.keepEditing'));
    expect(onKeepEditing).toHaveBeenCalled();
  });

  it('should call all footer handlers without fileName', () => {
    renderPreviewModal(defaultProps, '');

    fireEvent.click(screen.getByText('ui-bulk-edit.previewModal.downloadPreview'));
  });

  it('should display preview records when available', async () => {
    const contentUpdates = [
      {
        option: OPTIONS.STATUS,
        actions: [{
          type: ACTIONS.CLEAR_FIELD,
        }],
      },
    ];
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

    await act(async () => {
      renderPreviewModal({
        ...defaultProps,
        contentUpdates,
      });
    });

    expect(screen.getByText('ui-bulk-edit.previewModal.previewToBeChanged')).toBeVisible();

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
