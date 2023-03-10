import React from 'react';
import { createMemoryHistory } from 'history';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import { APPROACHES, JOB_STATUSES } from '../../constants';
import { useBulkOperationDetails } from '../../hooks/api';

import { ProgressBar } from './ProgressBar';

jest.mock('../../hooks/api', () => ({
  useBulkOperationDetails: jest.fn(),
}));

const mockShowCallout = jest.fn();
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(() => mockShowCallout),
}));

const history = createMemoryHistory();

const renderProgressBar = () => {
  render(
    <MemoryRouter initialEntries={['/bulk-edit/1/progress?processedFileName=some.scv']}>
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
    mockShowCallout.mockClear();
  });

  it('should display correct title', async () => {
    useBulkOperationDetails.mockReturnValue({ bulkDetails: bulkOperation });

    history.push({
      search: '?fileName=Mock.csv',
    });

    renderProgressBar();

    const title = await screen.findByText(/progressBar.title/);

    expect(title).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    useBulkOperationDetails.mockReturnValue({ bulkDetails: bulkOperation });

    renderProgressBar();

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should display correct width percentage', async () => {
    useBulkOperationDetails.mockReturnValue({ bulkDetails: bulkOperation });

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

      if (status === JOB_STATUSES.FAILED) {
        expect(mockShowCallout).toHaveBeenCalled();
      }
    });
  });

  it('callout should be called for query approach', async () => {
    useBulkOperationDetails.mockReturnValue({
      bulkDetails: {
        ...bulkOperation,
        status: JOB_STATUSES.FAILED,
        approach: APPROACHES.QUERY,
        errorMessage: 'some error message',
      },
      clearIntervalAndRedirect,
    });

    renderProgressBar();

    expect(clearIntervalAndRedirect).toHaveBeenCalled();
    expect(mockShowCallout).not.toHaveBeenCalled();
  });
});
