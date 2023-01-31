import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { noop } from 'lodash';

import { useOkapiKy } from '@folio/stripes/core';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../test/jest/__mock__';

import BulkEditActionMenu from './BulkEditActionMenu';
import { INVENTORY_COLUMNS, USER_COLUMNS } from '../../constants';
import {
  getInventoryResultsFormatterBase,
  getUserResultsFormatterBase,
} from '../../constants/formatters';
import { RootContext } from '../../context/RootContext';

jest.mock('../../API', () => ({
  useJob: () => ({
    data: {
      files: ['file1.csv', 'file2.csv'],
    },
  }),
  usePreviewRecords: () => ({
    items: [{ id: 1 }],
  }),
}));

const renderActionMenu = ({
  onEdit = noop,
  onDelete = noop,
  onToggle = noop,
  initialEntries,
  visibleColumns = JSON.stringify(Object.keys(getInventoryResultsFormatterBase()))
  ,
}) => {
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <RootContext.Provider value={{
        setNewBulkFooterShown: jest.fn(),
        setCountOfRecords: jest.fn(),
        setVisibleColumns: jest.fn(),
        visibleColumns,
      }}
      >
        <BulkEditActionMenu
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          errorCsvLink="file1.csv"
          successCsvLink="file2.csv"
        />,
      </RootContext.Provider>
    </MemoryRouter>,
  );
};

describe('BulkEditActionMenu', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            files: [
              'donwloadMathcedRecords.csv',
              'donwloadError.csv',
            ],
          }),
        }),
      });
  });

  it('displays Bulk edit', async () => {
    renderActionMenu({
      initialEntries: ['/bulk-edit/1?capabilities=USERS'],
    });

    const downloadButtons = [
      'download-link-matched',
      'download-link-error',
    ];

    await waitFor(() => downloadButtons.forEach((el) => expect(screen.getByTestId(el)).toBeVisible()));
  });

  it('should render correct default columns for users', async () => {
    renderActionMenu({
      initialEntries: ['/bulk-edit/1?capabilities=USERS'],
      visibleColumns: JSON.stringify(Object.keys(getUserResultsFormatterBase())),
    });

    for (const col of USER_COLUMNS) {
      const checkbox = await screen.findByLabelText(`ui-bulk-edit.columns.${col.value}`);

      expect(checkbox.checked).toBe(col.selected);
    }
  });

  it('should render with no axe errors', async () => {
    renderActionMenu({
      initialEntries: ['/bulk-edit/1?capabilities=USERS'],
    });

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should render correct default columns for inventory', async () => {
    renderActionMenu({
      initialEntries: ['/bulk-edit/1?capabilities=ITEMS'],
    });

    for (const col of INVENTORY_COLUMNS) {
      const checkbox = await screen.findByLabelText(`ui-bulk-edit.columns.${col.value}`);

      expect(checkbox.checked).toBe(col.selected);
    }
  });
});
