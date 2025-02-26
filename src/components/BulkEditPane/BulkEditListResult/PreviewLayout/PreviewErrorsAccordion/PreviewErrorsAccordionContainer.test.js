import React from 'react';

import { render, screen } from '@testing-library/react';

import { ERRORS_PAGINATION_CONFIG } from '../../../../../constants';
import { PreviewErrorsAccordionContainer } from './PreviewErrorsAccordionContainer';
import { useSearchParams } from '../../../../../hooks';
import { useBulkOperationStats } from '../../../../../hooks/useBulkOperationStats';
import { useErrorType } from '../../../../../hooks/useErrorType';
import { usePagination } from '../../../../../hooks/usePagination';
import { useErrorsPreview } from '../../../../../hooks/api';
import { isErrorsPreviewAvailable } from '../helpers';

let mockPreviewErrorsAccordionProps = {};

jest.mock('@folio/stripes/components', () => ({
  Layout: ({ children, ...props }) => (
    <div data-testid="layout" {...props}>
      {children}
    </div>
  ),
  Loading: () => <div data-testid="loading">Loading</div>,
}));

jest.mock('./PreviewErrorsAccordion', () => ({
  PreviewErrorsAccordion: (props) => {
    mockPreviewErrorsAccordionProps = props;
    return <div data-testid="preview-errors-accordion">PreviewErrorsAccordion</div>;
  },
}));

jest.mock('../../../../../hooks', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('../../../../../hooks/useBulkOperationStats', () => ({
  useBulkOperationStats: jest.fn(),
}));

jest.mock('../../../../../hooks/useErrorType', () => ({
  useErrorType: jest.fn(),
}));

jest.mock('../../../../../hooks/usePagination', () => ({
  usePagination: jest.fn(),
}));

jest.mock('../../../../../hooks/api', () => ({
  useErrorsPreview: jest.fn(),
}));

jest.mock('../helpers', () => ({
  isErrorsPreviewAvailable: jest.fn(),
}));

describe('PreviewErrorsAccordionContainer', () => {
  const bulkDetails = { id: '123', someProp: 'value' };

  const defaultPagination = { currentPage: 1 };
  const defaultChangePage = jest.fn();
  const defaultToggleShowWarnings = jest.fn();

  beforeEach(() => {
    mockPreviewErrorsAccordionProps = {};
    jest.clearAllMocks();

    useSearchParams.mockReturnValue({ step: 'upload' });
    useBulkOperationStats.mockReturnValue({
      countOfErrors: 2,
      countOfWarnings: 1,
    });
    useErrorType.mockReturnValue({
      errorType: 'someError',
      toggleShowWarnings: defaultToggleShowWarnings,
    });
    usePagination.mockReturnValue({
      pagination: defaultPagination,
      changePage: defaultChangePage,
    });
    useErrorsPreview.mockReturnValue({
      errors: [],
      isFetching: false,
      isLoading: false,
    });

    isErrorsPreviewAvailable.mockReturnValue(true);
  });

  it('renders loading state when isErrorsLoading is true', () => {
    useErrorsPreview.mockReturnValue({
      errors: [],
      isFetching: false,
      isLoading: true,
    });

    render(<PreviewErrorsAccordionContainer bulkDetails={bulkDetails} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('returns null when errors array is empty and not loading', () => {
    useErrorsPreview.mockReturnValue({
      errors: [],
      isFetching: false,
      isLoading: false,
    });

    const { container } = render(<PreviewErrorsAccordionContainer bulkDetails={bulkDetails} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders PreviewErrorsAccordion when errors exist', () => {
    const errorsData = [{ id: 'e1' }, { id: 'e2' }];
    useErrorsPreview.mockReturnValue({
      errors: errorsData,
      isFetching: false,
      isLoading: false,
    });

    render(<PreviewErrorsAccordionContainer bulkDetails={bulkDetails} />);

    expect(screen.getByTestId('preview-errors-accordion')).toBeInTheDocument();

    expect(mockPreviewErrorsAccordionProps.errors).toEqual(errorsData);
    expect(mockPreviewErrorsAccordionProps.totalErrors).toEqual(2); // from useBulkOperationStats
    expect(mockPreviewErrorsAccordionProps.totalWarnings).toEqual(1);
    expect(mockPreviewErrorsAccordionProps.errorType).toEqual('someError');
    expect(mockPreviewErrorsAccordionProps.onChangePage).toBe(defaultChangePage);
    expect(mockPreviewErrorsAccordionProps.pagination).toEqual(defaultPagination);
    expect(mockPreviewErrorsAccordionProps.isFetching).toEqual(false);
  });

  it('handles toggle warnings correctly', () => {
    const errorsData = [{ id: 'e1' }];
    useErrorsPreview.mockReturnValue({
      errors: errorsData,
      isFetching: false,
      isLoading: false,
    });

    render(<PreviewErrorsAccordionContainer bulkDetails={bulkDetails} />);

    expect(typeof mockPreviewErrorsAccordionProps.onShowWarnings).toBe('function');

    mockPreviewErrorsAccordionProps.onShowWarnings();

    expect(defaultChangePage).toHaveBeenCalledWith(ERRORS_PAGINATION_CONFIG);
    expect(defaultToggleShowWarnings).toHaveBeenCalled();
  });
});
