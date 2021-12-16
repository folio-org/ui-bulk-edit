import React from 'react';
import { render, screen } from '@testing-library/react';

import '../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router';
import { noop } from 'lodash';
import BulkEditActionMenu from './BulkEditActionMenu';
import * as useDownloadLinks from '../../API/useDownloadLinks';
import { DEFAULT_COLUMNS } from '../../constants/constants';

const renderActionMenu = ({
  onEdit = noop,
  onDelete = noop,
  onToggle = noop,
  initialEntries,
}) => {
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <BulkEditActionMenu onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />,
    </MemoryRouter>,
  );
};

describe('BulkEditActionMenu', () => {
  beforeEach(() => {
    jest.spyOn(useDownloadLinks, 'useDownloadLinks').mockImplementation(() => ({
      data: {
        files: ['file1.csv', 'file2.csv'],
      },
    }));
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
