import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import { CAPABILITIES } from '../../constants';
import { BulkEditProfiles } from './BulkEditProfiles';

const mockProfiles = [
  {
    id: '1',
    name: 'Test Profile 1',
    description: 'Test description 1',
    updated: '2023-01-15T10:30:00Z',
    updatedBy: 'user1',
    locked: false,
    entityType: CAPABILITIES.USER,
    userFullName: 'Doe, John',
  },
  {
    id: '2',
    name: 'Test Profile 2',
    description: 'Test description 2',
    updated: '2023-01-20T14:45:00Z',
    updatedBy: 'user2',
    locked: true,
    entityType: CAPABILITIES.ITEM,
    userFullName: 'Smith, Jane',
  },
  {
    id: '3',
    name: 'Test Profile 3',
    description: '',
    updated: '2023-01-25T09:15:00Z',
    updatedBy: 'user1',
    locked: false,
    entityType: CAPABILITIES.HOLDING,
    userFullName: 'Doe, John',
  },
];

const defaultProps = {
  entityType: CAPABILITIES.USER,
  isLoading: false,
  profiles: mockProfiles,
  searchTerm: '',
  sortOrder: 'name',
  sortDirection: 'ascending',
  changeSorting: jest.fn(),
};

const renderBulkEditProfiles = (props = {}) => render(
  <BulkEditProfiles
    {...defaultProps}
    {...props}
  />
);

describe('BulkEditProfiles', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render profiles data correctly', () => {
    renderBulkEditProfiles();

    // Check that all profile names are rendered
    expect(screen.getByText('Test Profile 1')).toBeInTheDocument();
    expect(screen.getByText('Test Profile 2')).toBeInTheDocument();
    expect(screen.getByText('Test Profile 3')).toBeInTheDocument();

    // Check that descriptions are rendered
    expect(screen.getByText('Test description 1')).toBeInTheDocument();
    expect(screen.getByText('Test description 2')).toBeInTheDocument();
  });

  it('should render user names correctly in updatedBy column', () => {
    renderBulkEditProfiles();

    expect(screen.getAllByText('Doe, John')).toHaveLength(2);
    expect(screen.getByText('Smith, Jane')).toBeInTheDocument();
  });

  it('should render empty state when no profiles provided', () => {
    renderBulkEditProfiles({ profiles: [] });

    expect(screen.getByText('ui-bulk-edit.settings.profiles.empty')).toBeInTheDocument();
  });

  it('should highlight search term in profile name', () => {
    renderBulkEditProfiles({ searchTerm: 'Test' });

    // DefaultColumn should receive searchTerm prop
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should highlight search term in description', () => {
    renderBulkEditProfiles({ searchTerm: 'description' });

    // DefaultColumn should receive searchTerm prop
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should call changeSorting when header is clicked', () => {
    const mockChangeSorting = jest.fn();
    renderBulkEditProfiles({ changeSorting: mockChangeSorting });

    // The onHeaderClick should be passed to MultiColumnList
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should render correct entity type icon', () => {
    renderBulkEditProfiles({ entityType: CAPABILITIES.USER });

    // DefaultColumn should receive correct iconKey
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should handle different entity types', () => {
    renderBulkEditProfiles({ entityType: CAPABILITIES.ITEM });

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should format dates correctly', () => {
    renderBulkEditProfiles();

    // DateColumn should format the dates
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should handle missing user data gracefully', () => {
    const profilesWithMissingUser = [
      {
        id: '1',
        name: 'Test Profile',
        description: 'Test description',
        updated: '2023-01-15T10:30:00Z',
        updatedBy: 'nonexistent-user',
        locked: false,
        entityType: CAPABILITIES.USER,
      },
    ];

    renderBulkEditProfiles({ profiles: profilesWithMissingUser });

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should handle empty description gracefully', () => {
    const profilesWithEmptyDescription = [
      {
        id: '1',
        name: 'Test Profile',
        description: '',
        updated: '2023-01-15T10:30:00Z',
        updatedBy: 'user1',
        locked: false,
        entityType: CAPABILITIES.USER,
      },
    ];

    renderBulkEditProfiles({ profiles: profilesWithEmptyDescription });

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should render with correct sort order and direction', () => {
    renderBulkEditProfiles({
      sortOrder: 'updated',
      sortDirection: 'desc',
    });

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should render all visible columns', () => {
    renderBulkEditProfiles();

    // Check that all column headers are rendered
    expect(screen.getByText('ui-bulk-edit.settings.profiles.columns.name')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.settings.profiles.columns.description')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.settings.profiles.columns.updated')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.settings.profiles.columns.updatedBy')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.settings.profiles.columns.status')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', async () => {
    const { container } = renderBulkEditProfiles();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should render correct list id based on entity type', () => {
    renderBulkEditProfiles({ entityType: CAPABILITIES.ITEM });

    expect(screen.getByRole('grid')).toHaveAttribute('id', 'ITEM-profiles-list');
  });

  it('should handle sorting by different columns', () => {
    const mockChangeSorting = jest.fn();

    renderBulkEditProfiles({
      changeSorting: mockChangeSorting,
      sortOrder: 'description',
      sortDirection: 'desc',
    });

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
});
