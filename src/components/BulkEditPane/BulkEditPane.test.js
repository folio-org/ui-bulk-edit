import React from 'react';
import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';

import '../../../test/jest/__mock__';

import { runAxeTest } from '@folio/stripes-testing';
import { queryClient } from '../../../test/jest/utils/queryClient';

import { CAPABILITIES, IDENTIFIERS, CRITERIA } from '../../constants';
import { BulkEditPane } from './BulkEditPane';

jest.mock('../BulkEditLogs/BulkEditLogs', () => {
  return {
    BulkEditLogs: jest.fn(() => <div>BulkEditLogs</div>),
  };
});

jest.mock('./BulkEditQuery/BulkEditQuery', () => {
  return {
    BulkEditQuery: jest.fn(({ children }) => (
      <div>
        BulkEditQuery
        {children && children()}
      </div>
    )),
  };
});

jest.mock('./BulkEditIdentifiers/BulkEditIdentifiers', () => {
  return {
    BulkEditIdentifiers: jest.fn(({ children }) => (
      <div>
        BulkEditIdentifiers
        {children && children()}
      </div>
    )),
  };
});

jest.mock('./BulkEditListResult', () => {
  return {
    BulkEditListResult: jest.fn().mockReturnValue('BulkEditListResult'),
  };
});

jest.mock('./BulkEditListResult/BulkEditProfileFlow/BulkEditProfileFlow', () => {
  return {
    BulkEditProfileFlow: jest.fn(() => <div>BulkEditProfileFlow</div>),
  };
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
  useBulkOperationUsers: jest.fn().mockReturnValue({
    data: { users: [] },
    isLoading: false,
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
      <MemoryRouter initialEntries={[`/bulk-edit/1/preview?${params}`]}>
        <BulkEditPane />
      </MemoryRouter>,
    </QueryClientProvider>,
  );
};

describe('BulkEditList', () => {
  it('should display Filters pane', async () => {
    renderBulkEditList({ criteria: CRITERIA.LOGS });

    expect(screen.getByText(/ui-bulk-edit.list.criteriaTitle/)).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    renderBulkEditList({ criteria: CRITERIA.LOGS });

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should display Logs pane when criteria is logs', async () => {
    renderBulkEditList({ criteria: CRITERIA.LOGS });

    await waitFor(() => expect(screen.getByText(/BulkEditLogs/)).toBeVisible());
  });

  it('should display Bulk edit identifiers when criteria is identifier', async () => {
    renderBulkEditList({ criteria: CRITERIA.IDENTIFIER });

    expect(screen.getByText(/BulkEditIdentifiers/)).toBeVisible();
  });

  it('should display Bulk edit query when criteria is query', async () => {
    renderBulkEditList({ criteria: CRITERIA.QUERY });

    expect(screen.getByText(/BulkEditQuery/)).toBeVisible();
  });
});
