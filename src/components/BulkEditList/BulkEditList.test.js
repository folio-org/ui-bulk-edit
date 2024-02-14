import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';

import '../../../test/jest/__mock__';

import userEvent from '@testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';
import { runAxeTest } from '@folio/stripes-testing';
import { queryClient } from '../../../test/jest/utils/queryClient';

import { CAPABILITIES, IDENTIFIERS, CRITERIA } from '../../constants';

import { BulkEditList } from './BulkEditList';

jest.mock('../BulkEditLogs/BulkEditLogs', () => {
  return jest.fn().mockReturnValue('BulkEditLogs');
});
jest.mock('./BulkEditListResult', () => {
  return {
    BulkEditListResult: jest.fn().mockReturnValue('BulkEditListResult'),
  };
});

jest.mock('@folio/stripes/core', () => ({
  useOkapiKy: jest.fn(),
}));
jest.mock('./BulkEditListResult/BulkEditManualUploadModal', () => {
  return {
    BulkEditManualUploadModal: jest.fn().mockReturnValue('BulkEditManualUploadModal'),
  };
});
jest.mock('./BulkEditListResult/BulkEditInAppPreviewModal/BulkEditInAppPreviewModal', () => {
  return jest.fn().mockReturnValue('BulkEditInAppPreviewModal');
});

jest.mock('../../hooks/api', () => ({
  ...jest.requireActual('../../hooks/api'),
  useQueryPlugin: jest.fn().mockReturnValue({
    entityTypeDataSource: jest.fn(),
    queryDetailsDataSource: jest.fn(),
    testQueryDataSource: jest.fn(),
    getParamsSource: jest.fn(),
    cancelQueryDataSource: jest.fn(),
  }),
}));

const renderBulkEditList = ({ criteria }) => {
  const params = new URLSearchParams({
    criteria,
    capabilities: CAPABILITIES.USER,
    identifier: IDENTIFIERS.ID,
    fileName: 'barcodes.csv',
  }).toString();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/bulk-edit/1/preview?${params}`]}>2
        <BulkEditList />
      </MemoryRouter>,
    </QueryClientProvider>,
  );
};

describe('BulkEditList', () => {
  it('should display Filters pane', async () => {
    renderBulkEditList({ criteria: CRITERIA.LOGS });

    expect(screen.getByText(/holdings/i)).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    renderBulkEditList({ criteria: CRITERIA.LOGS });

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should display Logs pane when criteria is logs', async () => {
    renderBulkEditList({ criteria: CRITERIA.LOGS });

    expect(screen.getByText(/BulkEditLogs/)).toBeVisible();
  });

  it('should display Bulk edit preview container when criteria is not logs', async () => {
    renderBulkEditList({ criteria: CRITERIA.IDENTIFIER });

    expect(screen.getByText(/BulkEditListResult/)).toBeVisible();
  });

  it('should display Bulk edit query', async () => {
    useOkapiKy.mockReturnValue({
      get: jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({}) }),
      post: jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({}) }),
      delete: jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({}) }),
    });
    renderBulkEditList({ criteria: CRITERIA.QUERY });

    userEvent.click(screen.getByText(/Get query/));
    userEvent.click(screen.getByText(/Cancel query/));

    expect(screen.getByText(/holdings/i)).toBeVisible();
  });
});
