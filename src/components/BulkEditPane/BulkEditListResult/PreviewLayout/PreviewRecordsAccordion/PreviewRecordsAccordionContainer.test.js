import React from 'react';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { PreviewRecordsAccordionContainer } from './PreviewRecordsAccordionContainer';
import { useSearchParams } from '../../../../../hooks';
import { useBulkOperationStats } from '../../../../../hooks/useBulkOperationStats';
import { usePagination } from '../../../../../hooks/usePagination';
import { useRecordsPreview } from '../../../../../hooks/api';
import { iseRecordsPreviewAvailable } from '../helpers';


let mockPreviewRecordsAccordionProps = {};

jest.mock('@folio/stripes/components', () => ({
  Layout: ({ children, ...props }) => (
    <div data-testid="layout" {...props}>
      {children}
    </div>
  ),
  Loading: () => <div data-testid="loading">Loading</div>,
}));

jest.mock('./PreviewRecordsAccordion', () => ({
  PreviewRecordsAccordion: (props) => {
    mockPreviewRecordsAccordionProps = props;
    return <div data-testid="preview-records-accordion">PreviewRecordsAccordion</div>;
  },
}));

jest.mock('../../../../../hooks', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('../../../../../hooks/useBulkOperationStats', () => ({
  useBulkOperationStats: jest.fn(),
}));

jest.mock('../../../../../hooks/usePagination', () => ({
  usePagination: jest.fn(),
}));

jest.mock('../../../../../hooks/api', () => ({
  useRecordsPreview: jest.fn(),
}));

jest.mock('../helpers', () => ({
  iseRecordsPreviewAvailable: jest.fn(),
}));


describe('PreviewRecordsAccordionContainer', () => {
  const bulkDetails = { id: '123', someProp: 'value' };

  const defaultPagination = { currentPage: 1 };
  const defaultChangePage = jest.fn();

  beforeEach(() => {
    mockPreviewRecordsAccordionProps = {};
    jest.clearAllMocks();

    useSearchParams.mockReturnValue({
      criteria: 'QUERY',
      queryRecordType: 'QUERY_RECORD_TYPE',
      step: 'UPLOAD',
      currentRecordType: 'ITEM',
    });

    useBulkOperationStats.mockReturnValue({
      countOfRecords: 100,
      visibleColumns: [
        { value: 'col1', selected: true },
        { value: 'col2', selected: true },
      ],
    });

    usePagination.mockReturnValue({
      pagination: defaultPagination,
      changePage: defaultChangePage,
    });

    useRecordsPreview.mockReturnValue({
      contentData: [],
      columns: ['column1', 'column2'],
      columnMapping: { column1: 'Column One', column2: 'Column Two' },
      isFetching: false,
      isLoading: false,
    });

    iseRecordsPreviewAvailable.mockReturnValue(true);
  });

  it('renders loading state when isPreviewLoading is true', () => {
    useRecordsPreview.mockReturnValue({
      contentData: [],
      columns: [],
      columnMapping: {},
      isFetching: false,
      isLoading: true,
    });

    render(<PreviewRecordsAccordionContainer bulkDetails={bulkDetails} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('returns null when contentData is empty and not loading', () => {
    useRecordsPreview.mockReturnValue({
      contentData: [],
      columns: [],
      columnMapping: {},
      isFetching: false,
      isLoading: false,
    });

    const { container } = render(<PreviewRecordsAccordionContainer bulkDetails={bulkDetails} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders PreviewRecordsAccordion when contentData exists', () => {
    const contentData = [{ id: 'r1' }, { id: 'r2' }];
    useRecordsPreview.mockReturnValue({
      contentData,
      columns: ['column1', 'column2'],
      columnMapping: { column1: 'Column One', column2: 'Column Two' },
      isFetching: false,
      isLoading: false,
    });

    render(<PreviewRecordsAccordionContainer bulkDetails={bulkDetails} />);

    expect(screen.getByTestId('preview-records-accordion')).toBeInTheDocument();

    expect(mockPreviewRecordsAccordionProps.totalRecords).toEqual(100);
    expect(mockPreviewRecordsAccordionProps.columns).toEqual(['column1', 'column2']);
    expect(mockPreviewRecordsAccordionProps.contentData).toEqual(contentData);
    expect(mockPreviewRecordsAccordionProps.columnMapping).toEqual({ column1: 'Column One', column2: 'Column Two' });
    expect(mockPreviewRecordsAccordionProps.visibleColumns).toEqual(['col1', 'col2']);
    expect(mockPreviewRecordsAccordionProps.onChangePage).toBe(defaultChangePage);
    expect(mockPreviewRecordsAccordionProps.pagination).toEqual(defaultPagination);
    expect(mockPreviewRecordsAccordionProps.isFetching).toBe(false);
  });
});
