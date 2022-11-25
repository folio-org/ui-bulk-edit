import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../test/jest/__mock__';

import BulkEdit from '../BulkEdit';
import { queryClient } from '../../../test/jest/utils/queryClient';
import { LOGS_COLUMNS } from '../../constants';
import { bulkEditLogsData } from '../../../test/jest/__mock__/fakeData';

jest.mock('../BulkEditList/BulkEditListResult', () => ({
  BulkEditListResult: () => 'BulkEditListResult',
}));

jest.doMock('../../API', () => ({
  ...jest.requireActual('../../API'),
  useBulkEditLogs: () => ({ isLoading: false, logs: bulkEditLogsData }),
}));


const renderBulkEditLogs = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/bulk-edit?criteria=logs']}>
        <BulkEdit />
      </MemoryRouter>,
    </QueryClientProvider>,
  );
};

describe('Logs', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        post: () => ({
          json: () => ({
            id: '1',
          }),
        }),
      });
  });


  it('Should render the logs table with correct columns', async () => {
    renderBulkEditLogs();

    for (const col of LOGS_COLUMNS) {
      const columnTitle = await screen.findByText(`ui-bulk-edit.columns.logs.${col.value}`);

      expect(columnTitle).toBeInTheDocument();
    }
  });
});
