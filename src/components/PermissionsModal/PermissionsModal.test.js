import {
  act,
  render,
  screen,
  waitFor,
  within,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';
import { QueryClientProvider } from 'react-query';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { PermissionsModal } from './PermissionsModal';
import { queryClient } from '../../../test/jest/utils/queryClient';
import { useAllPermissions } from './hooks/useAllPermissions';

jest.mock('./hooks/useAllPermissions');

const permissions = [
  {
    'permissionName': 'ui-bulk-edit.inventory.edit',
    'displayName': 'Bulk Edit: In app - Edit',
    'id': 'baa169b5-e36c-47fd-bbd7-10ad10fb9ce8',
    'mutable': false,
    'type': 'permissions',
  },
  {
    'permissionName': 'role-acq-admin',
    'displayName': 'role-acq-admin',
    'id': '7f704eb4-a32a-4bf2-8289-87e1d1390250',
    'mutable': true,
    'type': 'permissionsSets',
  },
  {
    'permissionName': 'ui-inventory.call-number-browse.view',
    'displayName': 'Call number browse: View permissions ',
    'id': 'bfc39ee7-4531-4347-85dd-8100a7e6ee45',
    'mutable': false,
    'type': 'permissions',
  },
];

const onCloseMock = jest.fn();
const onSaveMock = jest.fn();

const renderComponent = (selectedPermissionsIds = []) => render(
  <QueryClientProvider client={queryClient}>
    <PermissionsModal
      selectedPermissionsIds={selectedPermissionsIds}
      open
      onClose={onCloseMock}
      onSave={onSaveMock}
    />
  </QueryClientProvider>,
);

const checkRowsLength = (length) => {
  const tableBody = screen.getByRole('rowgroup', { hidden: true });

  expect(tableBody).toBeInTheDocument();

  const rows = within(tableBody).getAllByRole('row', { hidden: true });

  expect(rows).toHaveLength(length);
};

describe('PermissionsModal', () => {
  beforeEach(() => {
    useAllPermissions.mockReturnValue({
      permissions,
      isPermissionsLoading: false,
    });
  });

  afterEach(() => {
    onCloseMock.mockClear();
    onSaveMock.mockClear();

    useAllPermissions.mockClear();

    cleanup();
  });

  it('should render the modal with correct title', () => {
    renderComponent();

    const modalTitle = screen.getByText('ui-bulk-edit.permissionsModal.title');
    expect(modalTitle).toBeInTheDocument();
  });

  it('should call onCancel and onSave callbacks', async () => {
    renderComponent();

    const saveButton = screen.getByText('ui-bulk-edit.permissionsModal.save');
    const cancelButton = screen.getByText('ui-bulk-edit.permissionsModal.cancel');

    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(saveButton);
    });
    expect(onSaveMock).toHaveBeenCalled();

    await act(async () => {
      await userEvent.click(cancelButton);
    });
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should render rows selected by default', () => {
    const id = permissions[0].id;

    renderComponent([id]);

    const row0Checkbox = document.getElementById(id);

    expect(row0Checkbox.checked).toBeTruthy();
  });

  it('should render correct table based on data', () => {
    renderComponent();

    checkRowsLength(permissions.length);
  });

  it('should select row on click', async () => {
    renderComponent();

    const row0Checkbox = document.getElementById(permissions[0].id);

    userEvent.click(row0Checkbox);

    await waitFor(() => {
      expect(row0Checkbox.checked).toBeTruthy();
    });
  });

  it('should filter permissions by query', async () => {
    renderComponent();

    const searchInput = screen.getByTestId('search-permissions');
    const submitButton = screen.getByText('ui-bulk-edit.permissionsModal.filter.search');

    await act(async () => {
      await userEvent.type(searchInput, 'Bulk Edit');
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      checkRowsLength(1);
    });
  });

  it('should filter permissions by type "permissions"', async () => {
    renderComponent();

    const typeCheckbox = screen.getByRole('checkbox', { name: 'ui-bulk-edit.permissionsModal.filter.permissions', hidden: true });

    await act(async () => {
      await userEvent.click(typeCheckbox);
    });

    await waitFor(() => {
      checkRowsLength(2);
    });
  });

  it('should filter permissions by status "assigned"', async () => {
    renderComponent();
    const row0Checkbox = document.getElementById(permissions[0].id);
    const statusCheckbox = screen.getByRole('checkbox', { name: 'ui-bulk-edit.permissionsModal.filter.assigned', hidden: true });

    userEvent.click(row0Checkbox);

    await act(async () => {
      await userEvent.click(statusCheckbox);
    });

    await waitFor(() => {
      checkRowsLength(1);
    });
  });

  it('should sort by name', async () => {
    renderComponent();

    const nameHeader = screen.getByText('ui-bulk-edit.permissionsModal.list.columns.name');

    const row = screen.getAllByRole('row', { hidden: true });

    expect(row[1]).toHaveTextContent(/role-acq-admin/);

    userEvent.click(nameHeader);

    await waitFor(() => {
      expect(row[1]).toHaveTextContent(/ui-inventory.permission.call-number-browse.view/);
    });
  });

  it('should select all ', async () => {
    renderComponent();

    const nameHeader = screen.getByText('ui-bulk-edit.permissionsModal.list.columns.name', { hidden: true });

    const row = screen.getAllByRole('row', { hidden: true });

    expect(row[1]).toHaveTextContent(/role-acq-admin/);

    userEvent.click(nameHeader);

    await waitFor(() => {
      expect(row[1]).toHaveTextContent(/ui-inventory.permission.call-number-browse.view/);
    });
  });

  it('should reset filters when "reset button" clicked', async () => {
    renderComponent();

    const searchInput = screen.getByTestId('search-permissions', { hidden: true });
    const typeCheckbox = screen.getByRole('checkbox', { name: 'ui-bulk-edit.permissionsModal.filter.permissions', hidden: true });
    const statusCheckbox = screen.getByRole('checkbox', { name: 'ui-bulk-edit.permissionsModal.filter.assigned', hidden: true });

    const resetButton = document.getElementById('reset-permissions-filters');

    userEvent.type(searchInput, 'Bulk Edit');

    await waitFor(() => {
      expect(searchInput).toHaveValue('Bulk Edit');
    });

    act(() => {
      userEvent.click(typeCheckbox);
    });

    await waitFor(() => {
      expect(typeCheckbox.checked).toBeTruthy();
    });


    act(() => {
      userEvent.click(statusCheckbox);
    });

    await waitFor(() => {
      expect(statusCheckbox.checked).toBeTruthy();
    });

    act(() => {
      userEvent.click(resetButton);
    });

    await waitFor(() => {
      expect(typeCheckbox.checked).toBeFalsy();
      expect(statusCheckbox.checked).toBeFalsy();
      expect(searchInput).toHaveValue('');
    });
  });

  it('should reset individual filters when clear button clicked', async () => {
    renderComponent();

    const typeCheckbox = screen.getByRole('checkbox', { name: 'ui-bulk-edit.permissionsModal.filter.permissions', hidden: true });
    const resetButton = document.querySelectorAll('[data-test-clear-button]')[0];

    act(() => {
      userEvent.click(typeCheckbox);
    });

    await waitFor(() => {
      expect(typeCheckbox.checked).toBeTruthy();
    });

    act(() => {
      userEvent.click(resetButton);
    });

    await waitFor(() => {
      expect(typeCheckbox.checked).toBeFalsy();
    });
  });
});
