import React from 'react';
import { createMemoryHistory } from 'history';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import { EDITING_STEPS, ERRORS, JOB_STATUSES } from '../../../constants';

import '../../../../test/jest/__mock__/reactIntl.mock';

import { useBulkOperationDetails } from '../../../hooks/api';
import { ProgressBar } from './ProgressBar';

jest.mock('../../../hooks/api', () => ({
  useBulkOperationDetails: jest.fn(),
}));

jest.mock('../../../hooks/useErrorMessages', () => ({
  useErrorMessages: jest.fn().mockReturnValue({ showErrorMessage: jest.fn() }),
}));

const history = createMemoryHistory();

// Represents details that were (re)fetched after the progress bar mounted, i.e. trustworthy data
// for the current phase (always greater than the component's mount timestamp).
const FRESH = Number.MAX_SAFE_INTEGER;

const renderProgressBar = (step = '') => {
  render(
    <MemoryRouter initialEntries={[`/bulk-edit/1/preview?processedFileName=some.scv&criteria=identifier&progress=identifier&step=${step}`]}>
      <ProgressBar />
    </MemoryRouter>,
  );
};

describe('ProgressBar', () => {
  const bulkOperation = {
    processedNumOfRecords: 50,
    totalNumOfRecords: 100,
    status: JOB_STATUSES.APPLY_CHANGES,
  };

  const clearIntervalAndRedirect = jest.fn();

  beforeEach(() => {
    clearIntervalAndRedirect.mockClear();

    useBulkOperationDetails.mockClear();
  });

  it('should display the retrieving title while records are being retrieved', async () => {
    useBulkOperationDetails.mockReturnValue({
      bulkDetails: { ...bulkOperation, status: JOB_STATUSES.RETRIEVING_RECORDS },
      dataUpdatedAt: FRESH,
    });

    history.push({
      search: '?fileName=Mock.csv',
    });

    renderProgressBar();

    const title = await screen.findByText(/progressBar.title/);

    expect(title).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    useBulkOperationDetails.mockReturnValue({ bulkDetails: bulkOperation, dataUpdatedAt: FRESH });

    renderProgressBar();

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should render committing text when changes are being applied', async () => {
    useBulkOperationDetails.mockReturnValue({
      bulkDetails: { ...bulkOperation, status: JOB_STATUSES.APPLY_CHANGES },
      dataUpdatedAt: FRESH,
    });

    renderProgressBar();

    expect(screen.getByText('ui-bulk-edit.progressBar.committing')).toBeVisible();
    expect(screen.getByText('ui-bulk-edit.progressBar.processing')).toBeVisible();
  });

  it('should rely on status, not the URL step, for progress content', async () => {
    useBulkOperationDetails.mockReturnValue({
      bulkDetails: { ...bulkOperation, status: JOB_STATUSES.RETRIEVING_RECORDS },
      dataUpdatedAt: FRESH,
    });

    // step=UPLOAD previously forced "committing"; status must win now.
    renderProgressBar(EDITING_STEPS.UPLOAD);

    expect(screen.getByText('ui-bulk-edit.progressBar.retrieving')).toBeVisible();
    expect(screen.queryByText('ui-bulk-edit.progressBar.committing')).not.toBeInTheDocument();
  });

  it('should render "Deleting records" text when records are being deleted', async () => {
    useBulkOperationDetails.mockReturnValue({
      bulkDetails: { ...bulkOperation, status: JOB_STATUSES.DELETING_RECORDS },
      dataUpdatedAt: FRESH,
      clearIntervalAndRedirect,
    });

    renderProgressBar(EDITING_STEPS.COMMIT);

    // "Deleting records" is shown as both the title and the status line.
    const deletingMessage = await screen.findByText('ui-bulk-edit.progressBar.deleting');
    const processingMessage = await screen.findByText('ui-bulk-edit.progressBar.processing');

    expect(deletingMessage).toBeVisible();
    expect(processingMessage).toBeVisible();
  });

  it('should render a preloader instead of progress content while bulk operation details are loading', () => {
    useBulkOperationDetails.mockReturnValue({
      isLoading: true,
      clearIntervalAndRedirect,
    });

    renderProgressBar(EDITING_STEPS.COMMIT);

    expect(screen.getByTestId('preloader')).toBeVisible();
    // The default "retrieving" title must not leak out before details load.
    expect(screen.queryByText('ui-bulk-edit.progressBar.title')).not.toBeInTheDocument();
  });

  it('should show the preloader until details are refetched after mount, ignoring stale cache', () => {
    useBulkOperationDetails.mockReturnValue({
      // Cache still holds the previous phase's details for the same operation id.
      bulkDetails: { ...bulkOperation, status: JOB_STATUSES.APPLY_CHANGES },
      dataUpdatedAt: 1,
      clearIntervalAndRedirect,
    });

    renderProgressBar();

    expect(screen.getByTestId('preloader')).toBeVisible();
    expect(screen.queryByText('ui-bulk-edit.progressBar.committing')).not.toBeInTheDocument();
  });

  it('should show the preloader instead of default content on the final tick when a redirect is pending', () => {
    useBulkOperationDetails.mockReturnValue({
      bulkDetails: { ...bulkOperation, status: JOB_STATUSES.COMPLETED },
      clearIntervalAndRedirect,
    });

    renderProgressBar();

    expect(screen.getByTestId('preloader')).toBeVisible();
    // The default "retrieving" content must not flash before the redirect happens.
    expect(screen.queryByText('ui-bulk-edit.progressBar.retrieving')).not.toBeInTheDocument();
    expect(clearIntervalAndRedirect).toHaveBeenCalled();
  });

  it('should display correct width percentage', async () => {
    useBulkOperationDetails.mockReturnValue({ bulkDetails: bulkOperation, dataUpdatedAt: FRESH });

    const progress = (bulkOperation.processedNumOfRecords / bulkOperation.totalNumOfRecords) * 100;

    history.push({
      search: '?processedFileName=Mock.csv',
    });

    renderProgressBar();

    const progressLine = await screen.findByTestId('progress-line');

    expect(progressLine).toBeVisible();
    expect(progressLine.getAttribute('style')).toBe(`width: ${progress}%;`);
  });

  [
    JOB_STATUSES.COMPLETED,
    JOB_STATUSES.DATA_MODIFICATION,
    JOB_STATUSES.COMPLETED_WITH_ERRORS,
    JOB_STATUSES.FAILED,
  ].forEach(status => {
    it(`should redirect to preview when status is ${status}`, async () => {
      useBulkOperationDetails.mockReturnValue({
        bulkDetails: { ...bulkOperation, status },
        clearIntervalAndRedirect,
      });

      renderProgressBar();

      expect(clearIntervalAndRedirect).toHaveBeenCalled();
    });
  });
});

describe('test', () => {
  const bulkOperationWithError = {
    processedNumOfRecords: 50,
    totalNumOfRecords: 100,
    status: JOB_STATUSES.FAILED,
    errorMessage: ERRORS.TOKEN
  };

  it('should render with error', async () => {
    useBulkOperationDetails.mockClear().mockReturnValue({ bulkDetails: bulkOperationWithError,
      clearIntervalAndRedirect: jest.fn() });

    renderProgressBar();
  });
});
