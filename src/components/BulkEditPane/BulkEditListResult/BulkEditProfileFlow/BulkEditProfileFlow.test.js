import React from 'react';
import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import { BulkEditProfileFlow } from './BulkEditProfileFlow';

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id, values }) => <span data-testid={id}>{JSON.stringify(values)}</span>
}));

jest.mock('@folio/stripes/components', () => ({
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

jest.mock('@folio/stripes/core', () => ({
  AppIcon: ({ iconKey }) => <span data-testid="app-icon-core">{iconKey}</span>
}));

jest.mock('../../../BulkEditProfiles/BulkEditProfilesSearchAndView', () => ({
  BulkEditProfilesSearchAndView: ({ onRowClick }) => (
    <button type="button" data-testid="apply-profile" onClick={() => onRowClick(null, { ruleDetails: ['rule1', 'rule2'] })}>
      Apply Profile
    </button>
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
const mockUseConfirmChanges = jest.fn();
const mockUseProfilesFlow = jest.fn();
const mockUseCommitChanges = jest.fn();

jest.mock('../../../../hooks/useSearchParams', () => ({ useSearchParams: () => mockUseSearchParams() }));
jest.mock('../../../../hooks/api', () => ({ useContentUpdate: () => mockUseContentUpdate() }));
jest.mock('../../../../hooks/useConfirmChanges', () => ({ useConfirmChanges: () => mockUseConfirmChanges() }));
jest.mock('../../../../hooks/useProfilesFlow', () => ({ useProfilesFlow: () => mockUseProfilesFlow() }));
jest.mock('../../../../hooks/useCommitChanges', () => ({ useCommitChanges: () => mockUseCommitChanges() }));


describe('SelectProfileFlow', () => {
  const onClose = jest.fn();
  const onOpen = jest.fn();
  const bulkOperationId = 'op123';

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue({ currentRecordType: 'typeA' });
    mockUseContentUpdate.mockReturnValue({ contentUpdate: jest.fn((args) => ({ args })) });
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
      isUsersLoading: false,
      searchTerm: 'search',
      changeSearch: jest.fn(),
      changeLSorting: jest.fn(),
      clearProfilesState: jest.fn(),
    });
    mockUseCommitChanges.mockReturnValue({
      commitChanges: jest.fn(),
      isCommitting: false,
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
      contentUpdate({ bulkOperationRules: [
        { bulkOperationId, rule_details: 'rule1' },
        { bulkOperationId, rule_details: 'rule2' }
      ],
      totalRecords: 5 })
    ]);
    expect(onClose).toHaveBeenCalled();
  });

  test('renders preview modal when opened and handles commit and keep editing', () => {
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
    const commitHook = { commitChanges: jest.fn(), isCommitting: false };
    mockUseCommitChanges.mockReturnValueOnce(commitHook);

    render(<BulkEditProfileFlow open={false} bulkOperationId={bulkOperationId} onClose={onClose} onOpen={onOpen} />);
    fireEvent.click(screen.getByTestId('commit-changes'));
    expect(commitHook.commitChanges).toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('keep-editing'));
    expect(onOpen).toHaveBeenCalled();
  });
});
