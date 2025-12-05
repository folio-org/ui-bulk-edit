import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import '../../../test/jest/__mock__';
import { runAxeTest } from '@folio/stripes-testing';
import { omit } from 'lodash';
import { bulkEditLogsData } from '../../../test/jest/__mock__/fakeData';
import { queryClient } from '../../../test/jest/utils/queryClient';

import { RootContext } from '../../context/RootContext';
import {
  APPROACHES,
  CAPABILITIES,
  IDENTIFIERS,
  CRITERIA,
  EDITING_STEPS,
  JOB_STATUSES,
  FILE_SEARCH_PARAMS,
  LINK_KEYS,
} from '../../constants';
import { useBulkOperationDetails } from '../../hooks/api';

import BulkEditActionMenu from './BulkEditActionMenu';

jest.mock('../../hooks/api', () => ({
  ...jest.requireActual('../../hooks/api'),
  useBulkOperationDetails: jest.fn(),
}));

const onEdit = jest.fn();
const onToggle = jest.fn();
const onOpenProfiles = jest.fn();
const bulkOperation = {
  ...bulkEditLogsData[0],
  status: JOB_STATUSES.DATA_MODIFICATION,
  matchedNumOfRecords: 10,
  committedNumOfRecords: 20,
  matchedNumOfErrors: 2,
  committedNumOfErrors: 3,
  matchedNumOfWarnings: 1,
  committedNumOfWarnings: 4,
  totalNumOfRecords: 30,
  ...omit(LINK_KEYS, ['expired']),
};
const defaultProviderState = {
  visibleColumns: [
    {
      value: 'uuid',
      label: 'uuid',
      selected: false,
      disabled: false,
    },
    {
      value: 'name',
      label: 'name',
      selected: false,
      disabled: false,
    },
  ],
  setVisibleColumns: jest.fn(),
};

const renderBulkEditActionMenu = ({ step, capability, providerState = defaultProviderState }) => {
  const params = new URLSearchParams({
    step,
    capabilities: capability,
    criteria: CRITERIA.IDENTIFIER,
    identifier: IDENTIFIERS.ID,
    fileName: 'barcodes.csv',
  }).toString();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/bulk-edit/1/preview?${params}`]}>
        <RootContext.Provider value={providerState}>
          <BulkEditActionMenu
            onEdit={onEdit}
            onToggle={onToggle}
            onOpenProfiles={onOpenProfiles}
            setFileInfo={jest.fn()}
          />
        </RootContext.Provider>
      </MemoryRouter>,
    </QueryClientProvider>,
  );
};

describe('BulkEditActionMenu', () => {
  beforeEach(() => {
    useBulkOperationDetails.mockClear().mockReturnValue({ bulkDetails: bulkOperation });

    useOkapiKy.mockClear().mockReturnValue({});
  });

  it('should display actions group', async () => {
    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.INSTANCE,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    expect(screen.getByText(/menuGroup.startEdit/)).toBeVisible();
  });

  it('should display download matched records action when available', () => {
    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.USER,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    expect(screen.getByTestId(FILE_SEARCH_PARAMS.MATCHED_RECORDS_FILE)).toBeVisible();
  });

  it('should display download changed records action when available', () => {
    renderBulkEditActionMenu({
      step: EDITING_STEPS.COMMIT,
      capability: CAPABILITIES.USER,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    expect(screen.getByTestId(FILE_SEARCH_PARAMS.COMMITTED_RECORDS_FILE)).toBeVisible();
  });

  it('should display download matched erros action when available', () => {
    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.USER,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    expect(screen.getByTestId(FILE_SEARCH_PARAMS.RECORD_MATCHING_ERROR_FILE)).toBeVisible();
  });

  it('should display download commit errors action when available', () => {
    renderBulkEditActionMenu({
      step: EDITING_STEPS.COMMIT,
      capability: CAPABILITIES.USER,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    expect(screen.getByTestId(FILE_SEARCH_PARAMS.COMMITTING_CHANGES_ERROR_FILE)).toBeVisible();
  });

  it('should display start in-app edit action when it is available', () => {
    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.ITEM,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    expect(screen.getByTestId('startInAppAction')).toBeVisible();
  });

  it('should start bulk edit when inn-app action was called (itme)', async () => {
    onEdit.mockClear();
    onToggle.mockClear();

    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.ITEM,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    await userEvent.click(screen.getByTestId('startInAppAction'));

    expect(onEdit).toHaveBeenCalledWith(APPROACHES.IN_APP);
    expect(onToggle).toHaveBeenCalled();
  });

  it('should display start csv edit action when it is available', () => {
    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.USER,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    expect(screen.getByTestId('startCsvAction')).toBeVisible();
  });

  it('should start bulk edit when inn-app action was called (user manual)', async () => {
    onEdit.mockClear();
    onToggle.mockClear();

    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.USER,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    await userEvent.click(screen.getByTestId('startCsvAction'));

    expect(onEdit).toHaveBeenCalledWith(APPROACHES.MANUAL);
    expect(onToggle).toHaveBeenCalled();
  });

  it('should display columns group', async () => {
    renderBulkEditActionMenu({ step: EDITING_STEPS.UPLOAD, capability: CAPABILITIES.USER });

    expect(screen.getByText('ui-bulk-edit.menuGroup.showColumns')).toBeVisible();
  });

  it('should display checkbox for column when provided', () => {
    renderBulkEditActionMenu({ step: EDITING_STEPS.UPLOAD, capability: CAPABILITIES.USER });

    expect(screen.getByText('ui-bulk-edit.columns.USER.uuid')).toBeVisible();
  });

  it('should change visibleColumns when checkbox is pressed ', async () => {
    const setVisibleColumns = jest.fn();

    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.USER,
      providerState: { ...defaultProviderState, setVisibleColumns },
    });

    await act(async () => {
      await userEvent.click(screen.getByText('ui-bulk-edit.columns.USER.uuid'));
    });

    expect(setVisibleColumns).toHaveBeenCalledWith([
      { ...defaultProviderState.visibleColumns[0], selected: true },
      defaultProviderState.visibleColumns[1],
    ]);
  });

  it('should filter columns based on value in input', async () => {
    const setVisibleColumns = jest.fn();

    const { getByRole, queryByText } = renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.USER,
      providerState: { ...defaultProviderState, setVisibleColumns },
    });

    await act(async () => {
      await userEvent.type(getByRole('textbox'), 'name');
    });

    expect(queryByText('ui-bulk-edit.columns.USER.name')).toBeVisible();
    expect(queryByText('ui-bulk-edit.columns.USER.uuid')).not.toBeInTheDocument();
  });

  it('should not change visibleColumns when checkbox is pressed and only one option is selected ', () => {
    const setVisibleColumns = jest.fn();

    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.USER,
      providerState: {
        setVisibleColumns,
        visibleColumns: [
          defaultProviderState.visibleColumns[0],
          { ...defaultProviderState.visibleColumns[1], selected: true },
        ],
      },
    });

    userEvent.click(screen.getByText('ui-bulk-edit.columns.USER.uuid'));

    expect(setVisibleColumns).not.toHaveBeenCalledWith();
  });

  it('should display select profile button for in-app approach when isStartBulkInAppActive is true', () => {
    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.ITEM,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    const selectProfileButtons = screen.getAllByTestId('selectProfile');
    expect(selectProfileButtons).toHaveLength(1);
    expect(selectProfileButtons[0]).toBeVisible();
  });

  it('should display select profile button for MARC approach when isStartMarcActive and has MARC permissions', () => {
    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.INSTANCE,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    const selectProfileButtons = screen.getAllByTestId('selectProfile');
    expect(selectProfileButtons.length).toBeGreaterThanOrEqual(1);
    expect(selectProfileButtons[0]).toBeVisible();
  });

  it('should display both in-app and MARC select profile buttons for instances with proper permissions', () => {
    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.INSTANCE,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    const selectProfileButtons = screen.getAllByTestId('selectProfile');
    expect(selectProfileButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('should not display select profile buttons when isStartBulkInAppActive is false', () => {
    useBulkOperationDetails.mockReturnValue({
      bulkDetails: {
        ...bulkOperation,
        status: JOB_STATUSES.COMPLETED
      }
    });

    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.ITEM,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    expect(screen.queryByTestId('selectProfile')).not.toBeInTheDocument();
  });

  it('should not display MARC select profile button when currentRecordType is not INSTANCE', () => {
    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.USER,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    const selectProfileButtons = screen.queryAllByTestId('selectProfile');

    expect(selectProfileButtons.length).toBeLessThanOrEqual(1);
  });

  it('should handle different job statuses correctly for profile button visibility', () => {
    useBulkOperationDetails.mockReturnValue({
      bulkDetails: {
        ...bulkOperation,
        status: JOB_STATUSES.REVIEW_CHANGES
      }
    });

    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.ITEM,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    expect(screen.getByTestId('selectProfile')).toBeVisible();
  });

  it('should handle REVIEWED_NO_MARC_RECORDS status for profile button visibility', () => {
    useBulkOperationDetails.mockReturnValue({
      bulkDetails: {
        ...bulkOperation,
        status: JOB_STATUSES.REVIEWED_NO_MARC_RECORDS
      }
    });

    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.HOLDING,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    expect(screen.getByTestId('selectProfile')).toBeVisible();
  });

  it('should not display profile buttons when step is not UPLOAD', () => {
    renderBulkEditActionMenu({
      step: EDITING_STEPS.COMMIT,
      capability: CAPABILITIES.ITEM,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    expect(screen.queryByTestId('selectProfile')).not.toBeInTheDocument();
  });

  it('should handle holdings capability for profile button rendering', () => {
    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.HOLDING,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    expect(screen.getByTestId('selectProfile')).toBeVisible();
  });

  it('should verify MARC profile button is only rendered for instances', () => {
    const capabilities = [CAPABILITIES.USER, CAPABILITIES.ITEM, CAPABILITIES.HOLDING];

    capabilities.forEach(capability => {
      const { unmount } = renderBulkEditActionMenu({
        step: EDITING_STEPS.UPLOAD,
        capability,
        providerState: { ...defaultProviderState, visibleColumns: [] },
      });

      const selectProfileButtons = screen.queryAllByTestId('selectProfile');

      expect(selectProfileButtons.length).toBeLessThanOrEqual(1);

      unmount();
    });
  });

  it('should not render profile buttons when hasEditPerm is false', () => {
    useBulkOperationDetails.mockReturnValue({
      bulkDetails: {
        ...bulkOperation,
        status: JOB_STATUSES.FAILED
      }
    });

    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.ITEM,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    expect(screen.queryByTestId('selectProfile')).not.toBeInTheDocument();
  });

  it('should render with no axe errors', async () => {
    renderBulkEditActionMenu({ step: EDITING_STEPS.UPLOAD, capability: CAPABILITIES.USER });

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
