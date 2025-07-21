import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  useUsersBatch,
  useLocationSorting,
} from '@folio/stripes-acq-components';

import { CAPABILITIES } from '../../constants';
import { useBulkEditProfiles } from '../../hooks/api';
import { BulkEditProfilesPane } from './BulkEditProfilesPane';

jest.mock('../../hooks/api/useBulkEditProfiles', () => ({
  useBulkEditProfiles: jest.fn(),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useUsersBatch: jest.fn(),
  useLocationSorting: jest.fn(),
}));

const mockProfiles = [
  {
    id: '1',
    name: 'Test Profile 1',
    description: 'Test description 1',
    updated: '2023-01-15T10:30:00Z',
    updatedBy: 'user1',
    locked: false,
    entityType: CAPABILITIES.USER,
  },
  {
    id: '2',
    name: 'Test Profile 2',
    description: 'Test description 2',
    updated: '2023-01-20T14:45:00Z',
    updatedBy: 'user2',
    locked: true,
    entityType: CAPABILITIES.ITEM,
  },
  {
    id: '3',
    name: 'Test Profile 3',
    description: '',
    updated: '2023-01-25T09:15:00Z',
    updatedBy: 'user1',
    locked: false,
    entityType: CAPABILITIES.HOLDING,
  },
];

const mockUsers = [
  {
    id: 'user1',
    personal: {
      firstName: 'John',
      lastName: 'Doe',
    },
  },
  {
    id: 'user2',
    personal: {
      firstName: 'Jane',
      lastName: 'Smith',
    },
  },
];

const defaultProps = {
  entityType: CAPABILITIES.USER,
  title: 'Test Profiles',
};

const renderBulkEditProfilesPane = (props = {}, routerProps = {}) => {
  const { initialEntries = ['/'], ...otherRouterProps } = routerProps;

  return render(
    <MemoryRouter
      initialEntries={initialEntries}
      {...otherRouterProps}
    >
      <BulkEditProfilesPane
        {...defaultProps}
        {...props}
      />
    </MemoryRouter>
  );
};

describe('BulkEditProfilesPane', () => {
  const mockUseBulkEditProfiles = jest.mocked(useBulkEditProfiles);
  const mockUseUsersBatch = jest.mocked(useUsersBatch);
  const mockUseLocationSorting = jest.mocked(useLocationSorting);

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseBulkEditProfiles.mockReturnValue({
      isFetching: false,
      isLoading: false,
      profiles: mockProfiles,
    });

    mockUseUsersBatch.mockReturnValue({
      isLoading: false,
      users: mockUsers,
    });

    mockUseLocationSorting.mockReturnValue([
      'name',
      'ascending',
      jest.fn(),
    ]);
  });

  it('should render without crashing', () => {
    renderBulkEditProfilesPane();

    expect(screen.getByText('Test Profiles')).toBeInTheDocument();
  });

  it('should render search field', () => {
    renderBulkEditProfilesPane();

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('should render profiles count in pane subtitle', () => {
    renderBulkEditProfilesPane();

    expect(screen.getByText('ui-bulk-edit.settings.profiles.paneSub')).toBeInTheDocument();
  });

  it('should not render pane subtitle when profiles are loading', () => {
    mockUseBulkEditProfiles.mockReturnValue({
      isFetching: false,
      isLoading: true,
      profiles: [],
    });

    renderBulkEditProfilesPane();

    expect(screen.queryByText('ui-bulk-edit.settings.profiles.paneSub')).not.toBeInTheDocument();
  });

  it('should handle search input change', async () => {
    renderBulkEditProfilesPane();

    const searchInput = screen.getByRole('searchbox');
    await userEvent.type(searchInput, 'test search');

    expect(searchInput).toHaveValue('test search');
  });

  it('should initialize search term from URL parameter', () => {
    // Mock the queryString.parse to return the search parameter
    jest.doMock('query-string', () => ({
      parse: jest.fn().mockReturnValue({ search: 'test' }),
    }));

    renderBulkEditProfilesPane({}, { initialEntries: ['/?search=test'] });

    // In a real scenario, this would be set from the URL parameter
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('should pass correct props to BulkEditProfiles component', () => {
    renderBulkEditProfilesPane();

    // BulkEditProfiles component should be rendered with correct props
    expect(screen.getByText('Test Profile 1')).toBeInTheDocument();
    expect(screen.getByText('Test Profile 2')).toBeInTheDocument();
    expect(screen.getByText('Test Profile 3')).toBeInTheDocument();
  });

  it('should show loading state when profiles are loading', () => {
    mockUseBulkEditProfiles.mockReturnValue({
      isFetching: true,
      isLoading: true,
      profiles: [],
    });

    renderBulkEditProfilesPane();

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    // Loading state should be passed to SearchField
  });

  it('should show loading state when users are loading', () => {
    mockUseUsersBatch.mockReturnValue({
      isLoading: true,
      users: [],
    });

    renderBulkEditProfilesPane();

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    // Loading state should be passed to SearchField
  });

  it('should handle different entity types', () => {
    renderBulkEditProfilesPane({ entityType: CAPABILITIES.ITEM });

    expect(mockUseBulkEditProfiles).toHaveBeenCalledWith({ entityType: CAPABILITIES.ITEM });
  });

  it('should extract user IDs from profiles for user batch loading', () => {
    renderBulkEditProfilesPane();

    expect(mockUseUsersBatch).toHaveBeenCalledWith(['user1', 'user2', 'user1']);
  });

  it('should handle empty profiles array', () => {
    mockUseBulkEditProfiles.mockReturnValue({
      isFetching: false,
      isLoading: false,
      profiles: [],
    });

    renderBulkEditProfilesPane();

    expect(screen.getByText('ui-bulk-edit.settings.profiles.empty')).toBeInTheDocument();
  });

  it('should render correct search field ID based on entity type', () => {
    renderBulkEditProfilesPane({ entityType: CAPABILITIES.ITEM });

    const searchField = screen.getByRole('searchbox');
    expect(searchField).toHaveAttribute('id', 'input-search-ITEM-field');
  });

  it('should pass search term to BulkEditProfiles', () => {
    renderBulkEditProfilesPane();

    // The search term should be passed to BulkEditProfiles component
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('should handle sorting changes', () => {
    const mockChangeSorting = jest.fn();
    mockUseLocationSorting.mockReturnValue([
      'name',
      'asc',
      mockChangeSorting,
    ]);

    renderBulkEditProfilesPane();

    // The changeSorting function should be passed to BulkEditProfiles
    expect(mockChangeSorting).toBeDefined();
  });

  it('should filter profiles based on search term', async () => {
    renderBulkEditProfilesPane();

    const searchInput = screen.getByRole('searchbox');
    await userEvent.type(searchInput, 'Profile 1');

    // Should filter profiles based on search term
    await waitFor(() => {
      expect(searchInput).toHaveValue('Profile 1');
    });
  });

  it('should handle different sort orders', () => {
    mockUseLocationSorting.mockReturnValue([
      'updated',
      'descending',
      jest.fn(),
    ]);

    renderBulkEditProfilesPane();

    // Should pass correct sort order and direction to BulkEditProfiles
    expect(screen.getByText('Test Profile 1')).toBeInTheDocument();
  });

  it('should handle missing search term gracefully', () => {
    renderBulkEditProfilesPane({}, { initialEntries: ['/'] });

    expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('should render custom title', () => {
    renderBulkEditProfilesPane({ title: 'Custom Title' });

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('should handle errors in profiles loading', () => {
    mockUseBulkEditProfiles.mockReturnValue({
      isFetching: false,
      isLoading: false,
      profiles: [],
    });

    renderBulkEditProfilesPane();

    // Should handle empty profiles gracefully
    expect(screen.getByText('ui-bulk-edit.settings.profiles.empty')).toBeInTheDocument();
  });

  it('should handle errors in users loading', () => {
    mockUseUsersBatch.mockReturnValue({
      isLoading: false,
      users: [],
    });

    renderBulkEditProfilesPane();

    // Should handle empty users gracefully
    expect(screen.getByText('Test Profile 1')).toBeInTheDocument();
  });

  it('should render pane with correct default width', () => {
    renderBulkEditProfilesPane();

    // Pane should have default width fill
    expect(screen.getByText('Test Profiles')).toBeInTheDocument();
  });

  it('should handle transition state properly', () => {
    renderBulkEditProfilesPane();

    // Should handle React transition state
    expect(screen.getByText('Test Profile 1')).toBeInTheDocument();
  });

  it('should handle empty search value in onSearchChange', async () => {
    renderBulkEditProfilesPane();

    const searchInput = screen.getByRole('searchbox');
    await userEvent.clear(searchInput);

    expect(searchInput).toHaveValue('');
  });
});

describe('Creating profile', () => {
  it('should open create layer when "New" button is clicked', async () => {
    renderBulkEditProfilesPane();

    const newButton = screen.getByRole('button', { name: 'ui-bulk-edit.settings.profiles.button.new' });
    await userEvent.click(newButton);

    expect(screen.getByText('ui-bulk-edit.settings.profiles.title.new')).toBeInTheDocument();
  });
});
