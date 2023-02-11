import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';

import '../../../test/jest/__mock__';

import { queryClient } from '../../../test/jest/utils/queryClient';

import { CAPABILITIES, IDENTIFIERS, CRITERIA } from '../../constants';

import { BulkEditList } from './BulkEditList';

jest.mock('./BulkEditListFilters/BulkEditListFilters', () => {
  return {
    BulkEditListFilters: jest.fn().mockReturnValue('BulkEditListFilters'),
  };
});
jest.mock('../BulkEditLogs/BulkEditLogs', () => {
  return jest.fn().mockReturnValue('BulkEditLogs');
});
jest.mock('./BulkEditListResult', () => {
  return {
    BulkEditListResult: jest.fn().mockReturnValue('BulkEditListResult'),
  };
});
jest.mock('./BulkEditListResult/BulkEditManualUploadModal', () => {
  return {
    BulkEditManualUploadModal: jest.fn().mockReturnValue('BulkEditManualUploadModal'),
  };
});
jest.mock('./BulkEditListResult/BulkEditInAppPreviewModal/BulkEditInAppPreviewModal', () => {
  return jest.fn().mockReturnValue('BulkEditInAppPreviewModal');
});

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

    expect(screen.getByText('BulkEditListFilters')).toBeVisible();
  });

  it('should display Logs pane when criteria is logs', async () => {
    renderBulkEditList({ criteria: CRITERIA.LOGS });

    expect(screen.getByText(/BulkEditLogs/)).toBeVisible();
  });

  it('should display Bulk edit preview container when criteria is not logs', async () => {
    renderBulkEditList({ criteria: CRITERIA.IDENTIFIER });

    expect(screen.getByText(/BulkEditListResult/)).toBeVisible();
  });
});
