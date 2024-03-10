import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import '../../../test/jest/__mock__';
import { IntlProvider } from 'react-intl';
import { bulkEditLogsData } from '../../../test/jest/__mock__/fakeData';

import { LOGS_COLUMNS } from '../../constants';
import { useBulkEditLogs } from '../../hooks/api';

import { BulkEditLogs } from './BulkEditLogs';

jest.mock('react-virtualized-auto-sizer', () => jest.fn(
  (props) => <div>{props.children({ width: 100 })}</div>,
));
jest.mock('../../hooks/api', () => ({
  ...jest.requireActual('../../hooks/api'),
  useBulkEditLogs: jest.fn(),
}));

const renderBulkEditLogs = () => {
  render(
    <IntlProvider locale="en">
      <MemoryRouter initialEntries={['/bulk-edit?criteria=logs']}>
        <BulkEditLogs />
      </MemoryRouter>,
    </IntlProvider>
  );
};

describe('Logs', () => {
  beforeEach(() => {
    useBulkEditLogs.mockClear().mockReturnValue({
      isLoading: false,
      logs: bulkEditLogsData,
      logsCount: bulkEditLogsData.length,
    });
  });

  it('should fetch logs', () => {
    renderBulkEditLogs();

    expect(useBulkEditLogs).toHaveBeenCalled();
  });

  it('should render the logs table with correct columns', async () => {
    renderBulkEditLogs();

    for (const col of LOGS_COLUMNS) {
      const columnTitle = await screen.findByText(`ui-bulk-edit.columns.logs.${col.value}`);

      expect(columnTitle).toBeInTheDocument();
    }
  });
});
