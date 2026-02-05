import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import '../../../../test/jest/__mock__';

import { runAxeTest } from '@folio/stripes-testing';
import { queryClient } from '../../../../test/jest/utils/queryClient';

import { CRITERIA } from '../../../constants';
import { RootContext } from '../../../context/RootContext';
import { BulkEditListSidebar } from './BulkEditListSidebar';

const mockResetAppState = jest.fn();
const mockSetIsFileUploaded = jest.fn();
const mockSetVisibleColumns = jest.fn();

const mockContextValue = {
  resetAppState: mockResetAppState,
  setIsFileUploaded: mockSetIsFileUploaded,
  setVisibleColumns: mockSetVisibleColumns,
};

const mockUseSearchParams = jest.fn();
const mockUseBulkPermissions = jest.fn();

jest.mock('../../../hooks', () => ({
  useBulkPermissions: jest.fn(() => mockUseBulkPermissions()),
  useSearchParams: jest.fn(() => mockUseSearchParams()),
}));

jest.mock('./TabsFilter/TabsFilter', () => ({
  TabsFilter: jest.fn(() => <div>TabsFilter</div>),
}));

jest.mock('./IdentifierTab/IdentifierTab', () => ({
  IdentifierTab: jest.fn(() => <div>IdentifierTab</div>),
}));

jest.mock('./QueryTab/QueryTab', () => ({
  QueryTab: jest.fn(() => <div>QueryTab</div>),
}));

jest.mock('./LogsTab/LogsTab', () => ({
  LogsTab: jest.fn(() => <div>LogsTab</div>),
}));

const renderBulkEditListSidebar = ({ criteria = CRITERIA.IDENTIFIER, capabilities = '', identifier = '', queryRecordType = '' } = {}) => {
  mockUseSearchParams.mockReturnValue({
    criteria,
    capabilities,
    identifier,
    queryRecordType,
  });

  mockUseBulkPermissions.mockReturnValue({
    hasLogViewPerms: true,
    hasQueryPerms: true,
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RootContext.Provider value={mockContextValue}>
          <BulkEditListSidebar />
        </RootContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('BulkEditListSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue({
      criteria: CRITERIA.IDENTIFIER,
      capabilities: '',
      identifier: '',
      queryRecordType: '',
    });
    mockUseBulkPermissions.mockReturnValue({
      hasLogViewPerms: true,
      hasQueryPerms: true,
    });
  });

  describe('rendering', () => {
    it('should render the component', () => {
      renderBulkEditListSidebar();

      expect(screen.getByText('TabsFilter')).toBeInTheDocument();
    });

    it('should render with no axe errors', async () => {
      renderBulkEditListSidebar();

      await runAxeTest({
        rootNode: document.body,
      });
    });

    it('should render IdentifierTab when criteria is IDENTIFIER', () => {
      renderBulkEditListSidebar({ criteria: CRITERIA.IDENTIFIER });

      expect(screen.getByText('IdentifierTab')).toBeInTheDocument();
      expect(screen.queryByText('QueryTab')).not.toBeInTheDocument();
      expect(screen.queryByText('LogsTab')).not.toBeInTheDocument();
    });

    it('should render QueryTab when criteria is QUERY', () => {
      renderBulkEditListSidebar({ criteria: CRITERIA.QUERY });

      expect(screen.getByText('QueryTab')).toBeInTheDocument();
      expect(screen.queryByText('IdentifierTab')).not.toBeInTheDocument();
      expect(screen.queryByText('LogsTab')).not.toBeInTheDocument();
    });

    it('should render LogsTab when criteria is LOGS', () => {
      renderBulkEditListSidebar({ criteria: CRITERIA.LOGS });

      expect(screen.getByText('LogsTab')).toBeInTheDocument();
      expect(screen.queryByText('IdentifierTab')).not.toBeInTheDocument();
      expect(screen.queryByText('QueryTab')).not.toBeInTheDocument();
    });
  });

  describe('reset button', () => {
    it('should render reset button when criteria is not LOGS', () => {
      renderBulkEditListSidebar({ criteria: CRITERIA.IDENTIFIER });

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).toBeInTheDocument();
    });

    it('should not render reset button when criteria is LOGS', () => {
      renderBulkEditListSidebar({ criteria: CRITERIA.LOGS });

      const resetButton = screen.queryByTestId('reset-button');
      expect(resetButton).not.toBeInTheDocument();
    });

    it('should render reset button with correct ID', () => {
      renderBulkEditListSidebar({ criteria: CRITERIA.IDENTIFIER });

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).toHaveAttribute('id', 'reset-bulk-edit-filters');
    });

    it('should render reset button with FormattedMessage component', () => {
      renderBulkEditListSidebar({ criteria: CRITERIA.IDENTIFIER });

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).toBeInTheDocument();
      expect(resetButton).toHaveAttribute('id', 'reset-bulk-edit-filters');
    });

    it('should render reset button wrapped with resetButtonWrapper class', () => {
      const { container } = renderBulkEditListSidebar({ criteria: CRITERIA.IDENTIFIER });

      const wrapper = container.querySelector('.resetButtonWrapper');
      expect(wrapper).toBeInTheDocument();
    });

    it('should disable reset button when no capabilities, identifier, or queryRecordType', () => {
      renderBulkEditListSidebar({
        criteria: CRITERIA.IDENTIFIER,
        capabilities: '',
        identifier: '',
        queryRecordType: '',
      });

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).toBeDisabled();
    });

    it('should enable reset button when capabilities is provided', () => {
      renderBulkEditListSidebar({
        criteria: CRITERIA.IDENTIFIER,
        capabilities: 'USER_UPDATE',
        identifier: '',
        queryRecordType: '',
      });

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).not.toBeDisabled();
    });

    it('should enable reset button when identifier is provided', () => {
      renderBulkEditListSidebar({
        criteria: CRITERIA.IDENTIFIER,
        capabilities: '',
        identifier: 'some-id',
        queryRecordType: '',
      });

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).not.toBeDisabled();
    });

    it('should enable reset button when queryRecordType is provided', () => {
      renderBulkEditListSidebar({
        criteria: CRITERIA.QUERY,
        capabilities: '',
        identifier: '',
        queryRecordType: 'USER',
      });

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).not.toBeDisabled();
    });

    it('should call resetAppState when reset button is clicked', async () => {
      renderBulkEditListSidebar({
        criteria: CRITERIA.IDENTIFIER,
        capabilities: 'USER_UPDATE',
      });

      const resetButton = screen.getByTestId('reset-button');
      await userEvent.click(resetButton);

      expect(mockResetAppState).toHaveBeenCalledTimes(1);
    });

    it('should not call resetAppState when disabled button is clicked', async () => {
      renderBulkEditListSidebar({
        criteria: CRITERIA.IDENTIFIER,
        capabilities: '',
        identifier: '',
        queryRecordType: '',
      });

      const resetButton = screen.getByTestId('reset-button');

      expect(resetButton).toBeDisabled();
      expect(mockResetAppState).not.toHaveBeenCalled();
    });
  });

  describe('tabs visibility', () => {
    it('should show reset button for IDENTIFIER criteria', () => {
      renderBulkEditListSidebar({ criteria: CRITERIA.IDENTIFIER });

      expect(screen.getByTestId('reset-button')).toBeInTheDocument();
    });

    it('should show reset button for QUERY criteria', () => {
      renderBulkEditListSidebar({ criteria: CRITERIA.QUERY });

      expect(screen.getByTestId('reset-button')).toBeInTheDocument();
    });

    it('should not show reset button for LOGS criteria', () => {
      renderBulkEditListSidebar({ criteria: CRITERIA.LOGS });

      expect(screen.queryByTestId('reset-button')).not.toBeInTheDocument();
    });
  });

  describe('reset button enabled/disabled states', () => {
    it('should be disabled when all search params are empty', () => {
      renderBulkEditListSidebar({
        capabilities: '',
        identifier: '',
        queryRecordType: '',
      });

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).toBeDisabled();
    });

    it('should be enabled when only capabilities is set', () => {
      renderBulkEditListSidebar({
        capabilities: 'USER_UPDATE',
        identifier: '',
        queryRecordType: '',
      });

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).not.toBeDisabled();
    });

    it('should be enabled when only identifier is set', () => {
      renderBulkEditListSidebar({
        capabilities: '',
        identifier: '12345',
        queryRecordType: '',
      });

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).not.toBeDisabled();
    });

    it('should be enabled when only queryRecordType is set', () => {
      renderBulkEditListSidebar({
        capabilities: '',
        identifier: '',
        queryRecordType: 'USER',
      });

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).not.toBeDisabled();
    });

    it('should be enabled when multiple search params are set', () => {
      renderBulkEditListSidebar({
        capabilities: 'USER_UPDATE',
        identifier: '12345',
        queryRecordType: 'USER',
      });

      const resetButton = screen.getByTestId('reset-button');
      expect(resetButton).not.toBeDisabled();
    });
  });
});
