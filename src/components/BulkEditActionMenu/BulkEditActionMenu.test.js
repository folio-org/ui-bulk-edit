import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { MemoryRouter } from 'react-router';
import { noop } from 'lodash';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../test/jest/__mock__';

import BulkEditActionMenu from './BulkEditActionMenu';
import { DEFAULT_COLUMNS } from '../../constants';

jest.mock('../../API', () => ({
  useDownloadLinks: () => ({
    data: {
      files: ['file1.csv', 'file2.csv'],
    },
  }),
  usePreviewRecords: () => ({
    users: [{ id: 1 }],
  }),
}));

const renderActionMenu = ({
  onEdit = noop,
  onDelete = noop,
  onToggle = noop,
  initialEntries,
}) => {
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <BulkEditActionMenu
        onEdit={onEdit}
        onDelete={onDelete}
        onToggle={onToggle}
        errorCsvLink="file1.csv"
        successCsvLink="file2.csv"
      />,
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
              'donwloadMathcedRecords.com',
              'donwloadError.com',
            ],
          }),
        }),
      });
  });

  it('displays Bulk edit', async () => {
    renderActionMenu({
      initialEntries: ['/bulk-edit/1'],
    });

    const downloadButtons = [
      'download-link-matched',
      'download-link-error',
    ];

    await waitFor(() => downloadButtons.forEach((el) => expect(screen.getByTestId(el)).toBeVisible()));
  });

  it('should render correct default columns', async () => {
    renderActionMenu({
      initialEntries: ['/bulk-edit/1'],
    });

    for (const col of DEFAULT_COLUMNS) {
      const checkbox = await screen.findByLabelText(`ui-bulk-edit.columns.${col.value}`);

      expect(checkbox.checked).toBe(col.selected);
    }
  });

  it('should render correct columns state based on queryParams', async () => {
    renderActionMenu({
      initialEntries: ['/bulk-edit/1?selectedColumns=%5B"username"%5D'],
    });

    // username should be checked
    const usernameCheckbox = await screen.findByLabelText('ui-bulk-edit.columns.username');

    expect(usernameCheckbox.checked).toBeTruthy();

    // other columns should be unchecked
    for (const col of DEFAULT_COLUMNS.filter(i => i.value !== 'username')) {
      const checkbox = await screen.findByLabelText(`ui-bulk-edit.columns.${col.value}`);

      expect(checkbox.checked).toBeFalsy();
    }
  });
});
