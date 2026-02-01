import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import { ListSelect } from './ListSelect';

const mockOnChange = jest.fn();

jest.mock('@folio/stripes/core', () => ({
  useStripes: jest.fn(() => ({
    user: {
      user: {
        consortium: {
          centralTenantId: null,
        },
      },
    },
    okapi: {
      tenant: 'test-tenant',
    },
  })),
}));

jest.mock('../../../constants', () => ({
  identifierOptions: {
    user: [
      { value: 'ID', label: 'ui-bulk-edit.list.filters.recordIdentifier.userUUIDs', disabled: false },
      { value: 'BARCODE', label: 'ui-bulk-edit.list.filters.recordIdentifier.userBarcodes', disabled: false },
    ],
    item: [
      { value: 'BARCODE', label: 'ui-bulk-edit.list.filters.recordIdentifier.item.barcode', disabled: false },
      { value: 'ID', label: 'ui-bulk-edit.list.filters.recordIdentifier.item.UUID', disabled: false },
    ],
    holdings: [
      { value: 'ID', label: 'ui-bulk-edit.list.filters.recordIdentifier.holdings.holdingsUUID', disabled: false },
    ],
    instance: [
      { value: 'ID', label: 'ui-bulk-edit.list.filters.recordIdentifier.instance.instanceUUID', disabled: false },
    ],
  },
}));

const renderListSelect = (props = {}) => {
  const defaultProps = {
    value: '',
    capabilities: '',
    disabled: false,
    onChange: mockOnChange,
  };

  return render(<ListSelect {...defaultProps} {...props} />);
};

describe('ListSelect', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when no record type is selected (capabilities is empty)', () => {
    it('should render the select field as disabled', () => {
      renderListSelect({ capabilities: '' });

      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('should not mark the field as required', () => {
      renderListSelect({ capabilities: '' });

      const select = screen.getByRole('combobox');
      expect(select).not.toBeRequired();
    });

    it('should display tooltip text', () => {
      renderListSelect({ capabilities: '' });

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveTextContent('ui-bulk-edit.list.filters.recordIdentifier.tooltip');
    });

    it('should render with tooltip wrapper div', () => {
      const { container } = renderListSelect({ capabilities: '' });

      const wrapperDiv = container.querySelector('[aria-labelledby*="tooltip"]');
      expect(wrapperDiv).toBeInTheDocument();
    });
  });

  describe('when a record type is selected (capabilities is not empty)', () => {
    it('should render the select field as enabled when capabilities="user"', () => {
      renderListSelect({ capabilities: 'user' });

      const select = screen.getByRole('combobox');
      expect(select).not.toBeDisabled();
    });

    it('should mark the field as required', () => {
      renderListSelect({ capabilities: 'user' });

      const select = screen.getByRole('combobox');
      expect(select).toBeRequired();
    });

    it('should not render tooltip when capability is selected', () => {
      renderListSelect({ capabilities: 'user' });

      const tooltipText = screen.queryByText('ui-bulk-edit.list.filters.recordIdentifier.tooltip');
      expect(tooltipText).not.toBeInTheDocument();
    });

    it('should render with user identifier options', () => {
      renderListSelect({ capabilities: 'user' });

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('should render with item identifier options', () => {
      renderListSelect({ capabilities: 'item' });

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select).not.toBeDisabled();
    });

    it('should render with holdings identifier options', () => {
      renderListSelect({ capabilities: 'holdings' });

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select).not.toBeDisabled();
    });

    it('should render with instance identifier options', () => {
      renderListSelect({ capabilities: 'instance' });

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select).not.toBeDisabled();
    });
  });

  describe('when disabled prop is passed', () => {
    it('should remain disabled even when capabilities are selected', () => {
      renderListSelect({ capabilities: 'user', disabled: true });

      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('should be disabled when capabilities is empty and disabled is true', () => {
      renderListSelect({ capabilities: '', disabled: true });

      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });
  });

  describe('when value is provided', () => {
    it('should display the selected value', () => {
      renderListSelect({ capabilities: 'user', value: 'ID' });

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('ID');
    });
  });
});
