import React from 'react';
import { MemoryRouter } from 'react-router';
import {
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useOkapiKy } from '@folio/stripes/core';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';

import { QueryClientProvider } from 'react-query';
import { queryClient } from '../../../../../test/jest/utils/queryClient';

import { LogsFilters } from './LogsFilters';

const activeFiltersMock = {
  STATUS: ['New'],
  CAPABILITY: ['items'],
  completedDate: [
    '2021-12-01:2021-12-28',
  ],

};

const onChangeMock = jest.fn();
const resetFiltersMock = jest.fn();

const renderLogsFilters = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/bulk-edit?criteria=logs']}>
        <LogsFilters
          activeFilters={activeFiltersMock}
          onChange={onChangeMock}
          resetFilter={resetFiltersMock}
        />
      </MemoryRouter>,
    </QueryClientProvider>,
  );
};

describe('LogsFilters', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({ users: [{ value: '1', label: 'test' }] }),
        }),
      });
  });

  it('should contain Search and filter section', () => {
    renderLogsFilters();

    expect(screen.getByTestId('logsFilters')).toBeInTheDocument();
  });

  it('should be enabled filter buttons', () => {
    renderLogsFilters();

    const filterButton = [
      /logs.filter.title.status/,
      /logs.filter.title.capability/,
      /logs.filter.startDate/,
      /logs.filter.endDate/,
    ];

    filterButton.forEach(el => expect(screen.getByRole('button', { name: el })).toBeEnabled());
    filterButton.forEach(el => {
      act(() => userEvent.click(screen.getByRole('button', { name: el })));
    });
  });

  it('should have error messages', () => {
    renderLogsFilters();

    const dateFrom = screen.getAllByRole('textbox', { name: /from/i });
    const dateTo = screen.getAllByRole('textbox', { name: /to/i });
    const applyButton = screen.getAllByRole('button', { name: /apply/i });

    dateFrom.forEach(el => fireEvent.change(el, { target: { value: '2021-20-01' } }));
    dateTo.forEach(el => fireEvent.change(el, { target: { value: '2021-20-01' } }));
    applyButton.forEach(el => fireEvent.click(el));

    dateFrom.forEach(el => expect(el).toHaveValue('2021-20-01'));
    dateTo.forEach(el => expect(el).toHaveValue('2021-20-01'));
  });

  it('should render with no axe errors', async () => {
    renderLogsFilters();

    await runAxeTest({
      rootNode: screen.getByTestId('logsFilters'),
    });
  });
});
