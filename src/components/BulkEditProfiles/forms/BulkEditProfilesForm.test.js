import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen, fireEvent, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { BulkEditProfilesForm } from './BulkEditProfilesForm';

jest.mock('../../../hooks/useOptionsWithTenants', () => ({
  useOptionsWithTenants: jest.fn(() => ({
    options: [],
    areAllOptionsLoaded: true,
  })),
}));

jest.mock('../../../hooks/useBulkEditForm', () => ({
  useBulkEditForm: jest.fn(() => ({
    fields: [],
    setFields: jest.fn(),
    isValid: true,
    isPristine: true,
  })),
}));

describe('BulkEditProfilesForm', () => {
  const renderForm = (props = {}) => render(
    <IntlProvider locale="en">
      <BulkEditProfilesForm
        entityType="users"
        onClose={jest.fn()}
        onSave={jest.fn()}
        {...props}
      />
    </IntlProvider>
  );

  it('renders form with basic fields', () => {
    renderForm();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lockProfile/i)).toBeInTheDocument();
    expect(screen.getByText(/saveAndClose/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });

  it('handles name and description input', async () => {
    renderForm();

    const nameInput = screen.getByLabelText(/Name/i);
    const descriptionInput = screen.getByLabelText(/Description/i);

    await userEvent.type(nameInput, 'Test Profile');
    await userEvent.type(descriptionInput, 'This is a description');

    expect(nameInput).toHaveValue('Test Profile');
    expect(descriptionInput).toHaveValue('This is a description');
  });

  it('toggles lock checkbox', () => {
    renderForm();

    const checkbox = screen.getByLabelText(/lockProfile/i);
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('calls onSave with correct data when Save is clicked', async () => {
    const onSave = jest.fn();
    renderForm({ onSave });

    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, 'Test Name');

    const saveButton = screen.getByRole('button', { name: /saveAndClose/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Name',
          description: '',
          locked: false,
          entityType: 'users',
          ruleDetails: [],
        })
      );
    });
  });

  it('shows prevent close modal when trying to close with dirty form', async () => {
    renderForm();

    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, 'Test Name');

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(await screen.getByText(/unsavedChanges/i)).toBeInTheDocument();
    expect(await screen.getByText(/areYouSure/i)).toBeInTheDocument();
    expect(await screen.getByText(/closeWithoutSaving/i)).toBeInTheDocument();
  });

  it('calls onClose if form is pristine when Cancel is clicked', async () => {
    const onClose = jest.fn();
    renderForm({ onClose });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
