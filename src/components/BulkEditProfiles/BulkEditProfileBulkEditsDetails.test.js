import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  CAPABILITIES,
  getUserOptions,
} from '../../constants';
import { useOptionsWithTenants } from '../../hooks/useOptionsWithTenants';
import { BulkEditProfileBulkEditsDetails } from './BulkEditProfileBulkEditsDetails';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => <div>Loading</div>),
}));

jest.mock('../../hooks/useOptionsWithTenants', () => ({
  useOptionsWithTenants: jest.fn(),
}));

const ruleDetails = [
  {
    id: '123',
    option: 'ADMINISTRATIVE_NOTE',
    tenants: [],
    actionsDetails: {
      actions: [
        {
          name: 'ADD_TO_EXISTING',
          value: 'foo',
          parameters: [],
          tenants: []
        }
      ]
    }
  },
];

const defaultProps = {
  entityType: CAPABILITIES.USER,
  isLoading: false,
  ruleDetails,
};

const renderBulkEditProfileBulkEditsDetails = (props = {}) => render(
  <BulkEditProfileBulkEditsDetails
    {...defaultProps}
    {...props}
  />,
);

describe('BulkEditProfileBulkEditsDetails', () => {
  beforeEach(() => {
    useOptionsWithTenants.mockReturnValue({
      areAllOptionsLoaded: true,
      options: getUserOptions(jest.fn()),
    });
  });

  it('should render loading state when isLoading is true', () => {
    renderBulkEditProfileBulkEditsDetails({ isLoading: true });

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render profile bulk edits', () => {
    renderBulkEditProfileBulkEditsDetails();

    expect(screen.getByText('ui-bulk-edit.layer.column.options')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.layer.column.actions')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.layer.column.data')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', async () => {
    const { container } = renderBulkEditProfileBulkEditsDetails();

    await runAxeTest({ rootNode: container });
  });
});
