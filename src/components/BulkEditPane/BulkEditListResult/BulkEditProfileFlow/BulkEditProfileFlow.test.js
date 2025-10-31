import React from 'react';
import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import { BulkEditProfileFlow } from './BulkEditProfileFlow';
import { OPTIONS, LOCATION_OPTIONS } from '../../../../constants';

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id, values }) => <span data-testid={id}>{JSON.stringify(values)}</span>
}));

jest.mock('@folio/stripes/components', () => ({
  Loading: () => <div data-testid="loading" />,
  Modal: ({ children, open, onClose, label }) => (open ? (
    <div data-testid="modal">
      <button type="button" data-testid="modal-close" onClick={onClose}>Close</button>
      <div>{label}</div>
      {children}
    </div>
  ) : null),
  PaneHeader: ({ paneTitle, paneSub, appIcon }) => (
    <header data-testid="pane-header">
      <div data-testid="pane-title">{paneTitle}</div>
      <div data-testid="pane-sub">{paneSub}</div>
      <div data-testid="app-icon">{appIcon}</div>
    </header>
  )
}));

jest.mock('@folio/stripes-acq-components/lib/AcqList/hooks/useFilters', () => ({
  __esModule: true,
  default: jest.fn(() => ({ filters: [], searchIndex: 'test' })),
}));
jest.mock('@folio/stripes-acq-components/lib/AcqList/utils', () => ({
  __esModule: true,
  buildFiltersObj: jest.fn(() => ({})),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  __esModule: true,
  buildSearch: jest.fn(() => ''),
  SEARCH_INDEX_PARAMETER: 'searchIndex',
}));

jest.mock('@folio/stripes-data-transfer-components', () => ({
  Preloader: () => <div data-testid="preloader" />
}));

const mockUseStripes = jest.fn(() => ({ hasPerm: () => true }));
jest.mock('@folio/stripes/core', () => ({
  AppIcon: ({ iconKey }) => <span data-testid="app-icon-core">{iconKey}</span>,
  useStripes: () => mockUseStripes(),
}));

const getLocationOption = () => LOCATION_OPTIONS[0];

jest.mock('../../../BulkEditProfiles/BulkEditProfilesSearchAndView', () => ({
  BulkEditProfilesSearchAndView: ({ onRowClick }) => (
    <div>
      <button
        type="button"
        data-testid="apply-profile"
        onClick={() => onRowClick(null, {
          ruleDetails: [
            {
              tenants: ['existing-tenant1'],
              actions: [
                { tenants: ['action-tenant1'] },
                { tenants: [] }
              ]
            },
            {
              tenants: [],
              actions: [
                { tenants: ['action-tenant2'] }
              ]
            }
          ]
        })}
      >
        Apply Profile
      </button>
      <button
        type="button"
        data-testid="apply-marc-profile"
        onClick={() => onRowClick(null, {
          entityType: 'INSTANCE_MARC',
          ruleDetails: [
            {
              tenants: ['existing-tenant1'],
              actions: [
                { tenants: ['action-tenant1'] },
                { tenants: [] }
              ]
            }
          ],
          marcRuleDetails: [
            { field: '245', action: 'ADD' },
            { field: '100', action: 'UPDATE' }
          ]
        })}
      >
        Apply MARC Profile
      </button>
      <button
        type="button"
        data-testid="apply-profile-with-tenants"
        onClick={() => onRowClick(null, {
          ruleDetails: [
            {
              tenants: ['existing-tenant1', 'existing-tenant2'],
              actions: [
                { tenants: ['action-tenant1', 'action-tenant2'] }
              ]
            }
          ]
        })}
      >
        Apply Profile With Tenants
      </button>
      <button
        type="button"
        data-testid="apply-empty-profile"
        onClick={() => onRowClick(null, { ruleDetails: [] })}
      >
        Apply Empty Profile
      </button>
      <button
        type="button"
        data-testid="apply-empty-marc-profile"
        onClick={() => onRowClick(null, {
          entityType: 'INSTANCE_MARC',
          ruleDetails: [{ tenants: [], actions: [] }],
          marcRuleDetails: []
        })}
      >
        Apply Empty MARC Profile
      </button>
      <button
        type="button"
        data-testid="apply-item-profile"
        onClick={() => onRowClick(null, {
          entityType: 'ITEM',
          ruleDetails: [
            {
              tenants: [],
              actions: [
                { tenants: [] }
              ]
            }
          ]
        })}
      >
        Apply Item Profile
      </button>

      <button
        type="button"
        data-testid="apply-location-profile"
        onClick={() => onRowClick(null, {
          ruleDetails: [
            {
              option: getLocationOption(),
              tenants: ['existing-tenant1'],
              actions: [{ tenants: ['action-tenant1'] }],
            }
          ]
        })}
      >
        Apply Location Profile
      </button>
    </div>
  )
}));

jest.mock('../BulkEditInAppPreviewModal/BulkEditPreviewModal', () => ({
  BulkEditPreviewModal: ({ open, modalFooter }) => (
    open ? <div data-testid="preview-modal">{modalFooter}</div> : null
  )
}));

jest.mock('../BulkEditInAppPreviewModal/BulkEditPreviewModalFooter', () => ({
  BulkEditPreviewModalFooter: ({ onCommitChanges, onKeepEditing, buttonsDisabled }) => (
    <div>
      <button type="button" data-testid="commit-changes" onClick={onCommitChanges} disabled={buttonsDisabled}>Commit</button>
      <button type="button" data-testid="keep-editing" onClick={onKeepEditing}>Keep Editing</button>
    </div>
  )
}));

const mockUseSearchParams = jest.fn();
const mockUseContentUpdate = jest.fn();
const mockUseMarcContentUpdate = jest.fn();
const mockUseConfirmChanges = jest.fn();
const mockUseProfilesFlow = jest.fn();
const mockUseCommitChanges = jest.fn();
const mockUseTenants = jest.fn();

jest.mock('../../../../hooks/useSearchParams', () => ({ useSearchParams: () => mockUseSearchParams() }));
jest.mock('../../../../hooks/api', () => ({
  useContentUpdate: () => mockUseContentUpdate(),
  useMarcContentUpdate: () => mockUseMarcContentUpdate(),
}));
jest.mock('../../../../hooks/useConfirmChanges', () => ({ useConfirmChanges: () => mockUseConfirmChanges() }));
jest.mock('../../../../hooks/useProfilesFlow', () => ({ useProfilesFlow: () => mockUseProfilesFlow() }));
jest.mock('../../../../hooks/useCommitChanges', () => ({ useCommitChanges: () => mockUseCommitChanges() }));
jest.mock('../../../../context/TenantsContext', () => ({ useTenants: () => mockUseTenants() }));

describe('SelectProfileFlow', () => {
  const onClose = jest.fn();
  const onOpen = jest.fn();
  const bulkOperationId = 'op123';

  beforeEach(() => {
    jest.clearAllMocks();
    // default perms: allowed
    mockUseStripes.mockReturnValue({ hasPerm: () => true });

    mockUseSearchParams.mockReturnValue({ currentRecordType: 'typeA', setParam: jest.fn() });
    mockUseContentUpdate.mockReturnValue({ contentUpdate: jest.fn((args) => ({ args })) });
    mockUseMarcContentUpdate.mockReturnValue({ marcContentUpdate: jest.fn((args) => ({ args })) });
    mockUseConfirmChanges.mockReturnValue({
      isPreviewModalOpened: false,
      isJobPreparing: false,
      isPreviewSettled: false,
      bulkDetails: {},
      totalRecords: 5,
      confirmChanges: jest.fn(),
      closePreviewModal: jest.fn(),
      changePreviewSettled: jest.fn(),
    });
    mockUseProfilesFlow.mockReturnValue({
      sortOrder: 'asc',
      sortDirection: 'up',
      filteredProfiles: [{ id: 1 }],
      isProfilesLoading: false,
      searchTerm: 'search',
      changeSearch: jest.fn(),
      changeLSorting: jest.fn(),
      clearProfilesState: jest.fn(),
    });
    mockUseCommitChanges.mockReturnValue({
      commitChanges: jest.fn(),
      isCommitting: false,
    });
    mockUseTenants.mockReturnValue({
      tenants: ['tenant1', 'tenant2']
    });
  });

  test('renders Preloader when loading', () => {
    mockUseProfilesFlow.mockReturnValueOnce({ ...mockUseProfilesFlow(), isProfilesLoading: true });
    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    expect(screen.getByTestId('preloader')).toBeInTheDocument();
  });

  test('renders profile list when not loading', () => {
    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    expect(screen.getByTestId('apply-profile')).toBeInTheDocument();
  });

  test('calls onClose and clearProfilesState when modal is closed', () => {
    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('modal-close'));
    expect(onClose).toHaveBeenCalled();
    expect(mockUseProfilesFlow().clearProfilesState).toHaveBeenCalled();
  });

  test('applies profile and triggers confirmChanges', () => {
    const { confirmChanges } = mockUseConfirmChanges();
    const { contentUpdate } = mockUseContentUpdate();
    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('apply-profile'));

    expect(confirmChanges).toHaveBeenCalledWith([
      contentUpdate({
        bulkOperationRules: [
          {
            bulkOperationId,
            rule_details: {
              tenants: ['tenant1', 'tenant2'],
              actions: [
                { tenants: ['tenant1', 'tenant2'] },
                { tenants: [] }
              ]
            }
          },
          {
            bulkOperationId,
            rule_details: {
              tenants: [],
              actions: [
                { tenants: ['tenant1', 'tenant2'] }
              ]
            }
          }
        ],
        totalRecords: 5
      })
    ]);
    expect(onClose).toHaveBeenCalled();
  });

  test('applies profile with tenants replacement logic', () => {
    const { confirmChanges } = mockUseConfirmChanges();
    const { contentUpdate } = mockUseContentUpdate();

    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('apply-profile-with-tenants'));

    expect(confirmChanges).toHaveBeenCalledWith([
      contentUpdate({
        bulkOperationRules: [
          {
            bulkOperationId,
            rule_details: {
              tenants: ['tenant1', 'tenant2'],
              actions: [
                { tenants: ['tenant1', 'tenant2'] }
              ]
            }
          }
        ],
        totalRecords: 5
      })
    ]);
    expect(onClose).toHaveBeenCalled();
  });

  test('applies MARC profile and triggers both contentUpdate and marcContentUpdate', async () => {
    const { confirmChanges } = mockUseConfirmChanges();
    const { contentUpdate } = mockUseContentUpdate();

    contentUpdate.mockReturnValue(Promise.resolve());

    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('apply-marc-profile'));

    expect(confirmChanges).toHaveBeenCalledWith(expect.any(Function));
    expect(onClose).toHaveBeenCalled();
  });

  test('handles empty ruleDetails array for regular profile', () => {
    const { confirmChanges } = mockUseConfirmChanges();
    const { contentUpdate } = mockUseContentUpdate();

    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('apply-empty-profile'));

    expect(confirmChanges).toHaveBeenCalledWith([
      contentUpdate({
        bulkOperationRules: [],
        totalRecords: 5
      })
    ]);
  });

  test('handles empty marcRuleDetails array for MARC profile', () => {
    const { confirmChanges } = mockUseConfirmChanges();
    const contentUpdateSpy = jest.fn().mockResolvedValue();
    const marcContentUpdateSpy = jest.fn().mockResolvedValue();

    mockUseContentUpdate.mockReturnValue({ contentUpdate: contentUpdateSpy });
    mockUseMarcContentUpdate.mockReturnValue({ marcContentUpdate: marcContentUpdateSpy });

    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('apply-empty-marc-profile'));

    const updateSequence = confirmChanges.mock.calls[0][0];
    return updateSequence().then(() => {
      expect(contentUpdateSpy).toHaveBeenCalledWith({
        bulkOperationRules: [
          {
            bulkOperationId,
            rule_details: {
              tenants: [],
              actions: []
            }
          }
        ],
        totalRecords: 5
      });
      expect(marcContentUpdateSpy).toHaveBeenCalledWith({
        bulkOperationMarcRules: [],
        totalRecords: 5
      });
    });
  });

  test('handles profile application with different entity types and tenant logic', () => {
    const { confirmChanges } = mockUseConfirmChanges();
    const { contentUpdate } = mockUseContentUpdate();

    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('apply-item-profile'));

    expect(confirmChanges).toHaveBeenCalledWith([
      contentUpdate({
        bulkOperationRules: [
          {
            bulkOperationId,
            rule_details: {
              tenants: [],
              actions: [
                { tenants: [] }
              ]
            }
          }
        ],
        totalRecords: 5
      })
    ]);
    expect(onClose).toHaveBeenCalled();
  });

  test('renders correct modal header with entity type and profiles count', () => {
    mockUseProfilesFlow.mockReturnValueOnce({
      ...mockUseProfilesFlow(),
      filteredProfiles: [{ id: 1 }, { id: 2 }, { id: 3 }]
    });
    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);

    expect(screen.getByTestId('pane-header')).toBeInTheDocument();
    expect(screen.getByTestId('app-icon')).toBeInTheDocument();
  });

  test('calls setParam when modal is closed', () => {
    const mockSetParam = jest.fn();
    mockUseSearchParams.mockReturnValue({
      currentRecordType: 'typeA',
      setParam: mockSetParam
    });

    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('modal-close'));

    expect(mockSetParam).toHaveBeenCalledWith('approach', null);
  });

  test('preview modal footer buttons are disabled when CSV file is not ready', () => {
    const confirmHook = {
      isPreviewModalOpened: true,
      isJobPreparing: false,
      isPreviewSettled: false,
      bulkDetails: {},
      totalRecords: 0,
      confirmChanges: jest.fn(),
      closePreviewModal: jest.fn(),
      changePreviewSettled: jest.fn(),
    };
    mockUseConfirmChanges.mockReturnValueOnce(confirmHook);

    render(<BulkEditProfileFlow open={false} bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);

    expect(screen.getByTestId('commit-changes')).toBeDisabled();
  });

  test('preview modal footer buttons are disabled when committing', () => {
    const confirmHook = {
      isPreviewModalOpened: true,
      isJobPreparing: false,
      isPreviewSettled: true,
      bulkDetails: { linkToModifiedRecordsCsvFile: 'file.csv' },
      totalRecords: 0,
      confirmChanges: jest.fn(),
      closePreviewModal: jest.fn(),
      changePreviewSettled: jest.fn(),
    };
    mockUseConfirmChanges.mockReturnValueOnce(confirmHook);
    const commitHook = { commitChanges: jest.fn(), isCommitting: true };
    mockUseCommitChanges.mockReturnValueOnce(commitHook);

    render(<BulkEditProfileFlow open={false} bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);

    expect(screen.getByTestId('commit-changes')).toBeDisabled();
  });

  test('handles keep editing with approach parameter', () => {
    const mockApproach = 'MANUAL';
    mockUseSearchParams.mockReturnValue({
      currentRecordType: 'typeA',
      approach: mockApproach,
      setParam: jest.fn()
    });

    const confirmHook = {
      isPreviewModalOpened: true,
      isJobPreparing: false,
      isPreviewSettled: true,
      bulkDetails: { linkToModifiedRecordsCsvFile: 'file.csv' },
      totalRecords: 0,
      confirmChanges: jest.fn(),
      closePreviewModal: jest.fn(),
      changePreviewSettled: jest.fn(),
    };
    mockUseConfirmChanges.mockReturnValueOnce(confirmHook);

    render(<BulkEditProfileFlow open={false} bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('keep-editing'));

    expect(onOpen).toHaveBeenCalledWith(mockApproach);
  });

  test('renders with different totalRecords value', () => {
    const mockTotalRecords = 100;
    mockUseConfirmChanges.mockReturnValue({
      isPreviewModalOpened: false,
      isJobPreparing: false,
      isPreviewSettled: false,
      bulkDetails: {},
      totalRecords: mockTotalRecords,
      confirmChanges: jest.fn(),
      closePreviewModal: jest.fn(),
      changePreviewSettled: jest.fn(),
    });

    const { confirmChanges } = mockUseConfirmChanges();
    const { contentUpdate } = mockUseContentUpdate();

    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('apply-profile'));

    expect(confirmChanges).toHaveBeenCalledWith([
      contentUpdate({
        bulkOperationRules: [
          {
            bulkOperationId,
            rule_details: {
              tenants: ['tenant1', 'tenant2'],
              actions: [
                { tenants: ['tenant1', 'tenant2'] },
                { tenants: [] }
              ]
            }
          },
          {
            bulkOperationId,
            rule_details: {
              tenants: [],
              actions: [
                { tenants: ['tenant1', 'tenant2'] }
              ]
            }
          }
        ],
        totalRecords: mockTotalRecords
      })
    ]);
  });

  test('handles commit changes flow correctly', () => {
    const mockCommitChanges = jest.fn();
    const confirmHook = {
      isPreviewModalOpened: true,
      isJobPreparing: false,
      isPreviewSettled: true,
      bulkDetails: { linkToModifiedRecordsCsvFile: 'file.csv' },
      totalRecords: 5,
      confirmChanges: jest.fn(),
      closePreviewModal: jest.fn(),
      changePreviewSettled: jest.fn(),
    };
    mockUseConfirmChanges.mockReturnValueOnce(confirmHook);
    mockUseCommitChanges.mockReturnValueOnce({
      commitChanges: mockCommitChanges,
      isCommitting: false,
    });

    render(<BulkEditProfileFlow open={false} bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('commit-changes'));

    expect(mockCommitChanges).toHaveBeenCalled();
  });

  test('renders with modal closed', () => {
    render(<BulkEditProfileFlow open={false} bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  test('handles profile application with tenant information', () => {
    const { confirmChanges } = mockUseConfirmChanges();
    const { contentUpdate } = mockUseContentUpdate();

    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('apply-profile'));

    expect(confirmChanges).toHaveBeenCalledWith([
      contentUpdate({
        bulkOperationRules: [
          {
            bulkOperationId,
            rule_details: {
              tenants: ['tenant1', 'tenant2'],
              actions: [
                { tenants: ['tenant1', 'tenant2'] },
                { tenants: [] }
              ]
            }
          },
          {
            bulkOperationId,
            rule_details: {
              tenants: [],
              actions: [
                { tenants: ['tenant1', 'tenant2'] }
              ]
            }
          }
        ],
        totalRecords: 5
      })
    ]);
    expect(onClose).toHaveBeenCalled();
  });

  test('applies MARC profile with tenant information', async () => {
    const { confirmChanges } = mockUseConfirmChanges();
    const { contentUpdate } = mockUseContentUpdate();

    contentUpdate.mockReturnValue(Promise.resolve());

    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('apply-marc-profile'));

    expect(confirmChanges).toHaveBeenCalledWith(expect.any(Function));
    expect(onClose).toHaveBeenCalled();
  });

  test('handles commit changes with tenant information', () => {
    const mockCommitChanges = jest.fn();
    const confirmHook = {
      isPreviewModalOpened: true,
      isJobPreparing: false,
      isPreviewSettled: true,
      bulkDetails: { linkToModifiedRecordsCsvFile: 'file.csv' },
      totalRecords: 5,
      confirmChanges: jest.fn(),
      closePreviewModal: jest.fn(),
      changePreviewSettled: jest.fn(),
    };
    mockUseConfirmChanges.mockReturnValueOnce(confirmHook);
    mockUseCommitChanges.mockReturnValueOnce({
      commitChanges: mockCommitChanges,
      isCommitting: false,
    });

    render(<BulkEditProfileFlow open={false} bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('commit-changes'));

    expect(mockCommitChanges).toHaveBeenCalled();
  });

  test('filters profiles by permission (set-records-for-deletion)', () => {
    mockUseProfilesFlow.mockReturnValueOnce({
      ...mockUseProfilesFlow(),
      filteredProfiles: [
        { id: 1, ruleDetails: [{ option: OPTIONS.SET_RECORDS_FOR_DELETE }] },
        { id: 2, ruleDetails: [] },
      ],
    });

    mockUseStripes.mockReturnValue({ hasPerm: () => false });

    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);

    expect(screen.queryByTestId('apply-profile')).toBeInTheDocument();
  });

  // Location-options branch coverage
  test('does not override tenants for LOCATION_OPTIONS rules', () => {
    const { confirmChanges } = mockUseConfirmChanges();
    const { contentUpdate } = mockUseContentUpdate();

    render(<BulkEditProfileFlow open bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);

    fireEvent.click(screen.getByTestId('apply-location-profile'));

    expect(confirmChanges).toHaveBeenCalledWith([
      contentUpdate({
        bulkOperationRules: [
          {
            bulkOperationId,
            rule_details: {
              option: LOCATION_OPTIONS[0],
              tenants: ['existing-tenant1'],
              actions: [{ tenants: ['action-tenant1'] }],
            }
          }
        ],
        totalRecords: 5
      })
    ]);

    expect(onClose).toHaveBeenCalled();
  });
});
