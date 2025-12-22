import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { BulkEditPreviewModalList } from './BulkEditPreviewModalList';
import { JOB_STATUSES } from '../../../../constants';

import { usePagination } from '../../../../hooks/usePagination';
import {
  useBulkOperationDetails,
  useRecordsPreview,
} from '../../../../hooks/api';
import { usePathParams, useSearchParams } from '../../../../hooks';
import { useErrorMessages } from '../../../../hooks/useErrorMessages';

import '../../../../../test/jest/__mock__';

jest.mock('../../../../hooks/usePagination', () => ({
  usePagination: jest.fn(),
}));

jest.mock('../../../../hooks/api', () => ({
  PREVIEW_MODAL_KEY: 'preview-key',
  useBulkOperationDetails: jest.fn(),
  useRecordsPreview: jest.fn(),
}));

jest.mock('../../../../hooks', () => ({
  usePathParams: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('../../../../hooks/useErrorMessages', () => ({
  useErrorMessages: jest.fn(),
}));

jest.mock('@folio/stripes-data-transfer-components', () => ({
  Preloader: () => <div data-testid="preloader">Preloader</div>,
}));

jest.mock('@folio/stripes/components', () => ({
  MessageBanner: ({ children }) => (
    <div data-testid="message-banner">{children}</div>
  ),
  MultiColumnList: ({ contentData }) => (
    <div data-testid="multi-column-list">
      Rows: {contentData ? contentData.length : 0}
    </div>
  ),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  PrevNextPagination: ({ onChange }) => (
    <button type="button" data-testid="pagination" onClick={onChange}>
      Next
    </button>
  ),
}));

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id, values }) => (
    <div data-testid={`formatted-${id}`}>
      {id} {values && JSON.stringify(values)}
    </div>
  ),
}));

describe('BulkEditPreviewModalList', () => {
  const defaultVisibleColumns = [
    { selected: true, value: 'col1' },
    { selected: true, value: 'col2' },
  ];

  const renderComponent = (props = {}) => render(
    <BulkEditPreviewModalList {...props} />
  );

  const defaultPagination = {
    page: 1,
    pageSize: 10,
    totalCount: 10,
  };
  const changePageMock = jest.fn();

  const defaultBulkDetails = {
    id: 'bulkOpId',
    status: JOB_STATUSES.REVIEW_CHANGES,
    processedNumOfRecords: 10,
    matchedNumOfRecords: 10,
  };

  const defaultRecordsPreview = {
    contentData: [{ id: 1 }, { id: 2 }],
    columnMapping: { col1: 'Column 1', col2: 'Column 2' },
    isFetching: false,
    visibleColumns: defaultVisibleColumns,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    usePathParams.mockReturnValue({ id: 'bulkOpId' });
    useSearchParams.mockReturnValue({ currentRecordType: 'someRecordType' });
    useErrorMessages.mockReturnValue({ showErrorMessage: jest.fn() });
    usePagination.mockReturnValue({
      pagination: defaultPagination,
      changePage: changePageMock,
    });
    useBulkOperationDetails.mockReturnValue({ bulkDetails: defaultBulkDetails });
    useRecordsPreview.mockReturnValue(defaultRecordsPreview);
  });

  test('renders message banner with "not supported" message when there are no supported entities', () => {
    useBulkOperationDetails.mockReturnValue({
      bulkDetails: {
        ...defaultBulkDetails,
        status: JOB_STATUSES.REVIEWED_NO_MARC_RECORDS,
      },
    });

    renderComponent();

    expect(
      screen.getByTestId(
        'formatted-ui-bulk-edit.previewModal.message.empty.notSupported'
      )
    ).toBeInTheDocument();
  });

  test('renders message banner with "partly supported" message when there are both supported and unsupported entities', () => {
    useBulkOperationDetails.mockReturnValue({
      bulkDetails: {
        ...defaultBulkDetails,
        processedNumOfRecords: 7,
        matchedNumOfRecords: 10, // unsupported = 3
      },
    });

    renderComponent();

    const banner = screen.getByTestId(
      'formatted-ui-bulk-edit.previewModal.message.empty.partlySupported'
    );

    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent(
      JSON.stringify({
        numberOfUnsupportedEntities: 3,
        numberOfSupportedEntities: 7,
      })
    );
  });

  test('renders default message banner when only supported entities exist', () => {
    useBulkOperationDetails.mockReturnValue({
      bulkDetails: {
        ...defaultBulkDetails,
        processedNumOfRecords: 8,
        matchedNumOfRecords: 8,
      },
    });

    renderComponent();

    const banner = screen.getByTestId(
      'formatted-ui-bulk-edit.previewModal.message'
    );

    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent(JSON.stringify({ count: 8 }));
  });
});
