import React from 'react';
import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { checkIfUserInCentralTenant } from '@folio/stripes/core';

import { MaterialTypesControl } from './MaterialTypesControl';
import { useMaterialTypes, useMaterialTypesEcs } from '../../../../../../hooks/api';
import { useTenants } from '../../../../../../context/TenantsContext';

import '../../../../../../../test/jest/__mock__/reactIntl.mock';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn().mockReturnValue({}),
  checkIfUserInCentralTenant: jest.fn(() => false),
}));

jest.mock('../../../../../../hooks/api/useMaterialTypes');
jest.mock('../../../../../../hooks/api/useMaterialTypesEcs');

jest.mock('../../../../../../context/TenantsContext', () => ({
  useTenants: jest.fn(() => ({ tenants: [] })),
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: () => <div data-testid="loading-spinner" />,
  Selection: jest.fn(({ onChange, placeholder, 'aria-label': ariaLabel, value, dataOptions }) => (
    <div>
      <label htmlFor="material-type-select">{ariaLabel}</label>
      <select
        id="material-type-select"
        aria-label={ariaLabel}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {(dataOptions || []).map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )),
}));

describe('MaterialTypesControl', () => {
  const defaultProps = {
    value: '',
    path: [0, 'value'],
    name: 'materialType',
    disabled: false,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useMaterialTypes.mockReturnValue({ materialTypes: [], isLoading: false });
    useMaterialTypesEcs.mockReturnValue({ escData: [], isFetching: false });
    useTenants.mockReturnValue({ tenants: [] });
    checkIfUserInCentralTenant.mockReturnValue(false);
  });

  it('renders the Selection with the correct placeholder', () => {
    render(<MaterialTypesControl {...defaultProps} />);

    expect(screen.getByRole('combobox', { name: /ui-bulk-edit.ariaLabel.materialTypeSelect/ })).toBeInTheDocument();
  });

  it('renders options from useMaterialTypes in non-ECS mode', () => {
    const materialTypes = [
      { value: '1', label: 'Book' },
      { value: '2', label: 'Video' },
    ];
    useMaterialTypes.mockReturnValue({ materialTypes, isLoading: false });

    render(<MaterialTypesControl {...defaultProps} />);

    expect(screen.getByRole('option', { name: 'Book' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Video' })).toBeInTheDocument();
  });

  it('calls onChange with val, path, name and null tenants in non-ECS mode', () => {
    const materialTypes = [{ value: '1', label: 'Book' }];
    useMaterialTypes.mockReturnValue({ materialTypes, isLoading: false });

    render(<MaterialTypesControl {...defaultProps} />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

    expect(defaultProps.onChange).toHaveBeenCalledWith({
      path: [0, 'value'],
      val: '1',
      name: 'materialType',
      tenants: null,
    });
  });

  it('shows the Loading spinner when ECS data is being fetched', () => {
    checkIfUserInCentralTenant.mockReturnValue(true);
    useMaterialTypesEcs.mockReturnValue({ escData: [], isFetching: true });

    render(<MaterialTypesControl {...defaultProps} />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('renders ECS material types deduplicated when on a central tenant', () => {
    checkIfUserInCentralTenant.mockReturnValue(true);
    useTenants.mockReturnValue({ tenants: ['college', 'university'] });
    useMaterialTypesEcs.mockReturnValue({
      escData: [
        { value: '1', label: 'Book (college)', tenant: 'college' },
        { value: '1', label: 'Book (university)', tenant: 'university' },
        { value: '2', label: 'Video (college)', tenant: 'college' },
      ],
      isFetching: false,
    });

    render(<MaterialTypesControl {...defaultProps} />);

    const options = screen.getAllByRole('option');
    const optionValues = options.map(o => o.value);

    expect(optionValues.filter(v => v === '1')).toHaveLength(1);
    expect(optionValues.filter(v => v === '2')).toHaveLength(1);
  });

  it('calls onChange with collected tenants when on a central tenant', () => {
    checkIfUserInCentralTenant.mockReturnValue(true);
    useTenants.mockReturnValue({ tenants: ['college', 'university'] });
    useMaterialTypesEcs.mockReturnValue({
      escData: [
        { value: '1', label: 'Book (college)', tenant: 'college' },
        { value: '1', label: 'Book (university)', tenant: 'university' },
      ],
      isFetching: false,
    });

    render(<MaterialTypesControl {...defaultProps} />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

    expect(defaultProps.onChange).toHaveBeenCalledWith({
      path: [0, 'value'],
      val: '1',
      name: 'materialType',
      tenants: ['college', 'university'],
    });
  });
});
