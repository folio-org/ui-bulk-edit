import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import '../../../test/jest/__mock__';
import { bulkEditLogsData } from '../../../test/jest/data/fakeData';
import { queryClient } from '../../../test/jest/utils/queryClient';

import { RootContext } from '../../context/RootContext';
import {
  APPROACHES,
  CAPABILITIES,
  IDENTIFIERS,
  CRITERIA,
  EDITING_STEPS,
  JOB_STATUSES,
  FILE_KEYS,
  FILE_SEARCH_PARAMS,
} from '../../constants';
import { useBulkOperationDetails } from '../../hooks/api';

import BulkEditActionMenu from './BulkEditActionMenu';

jest.mock('../../hooks/api', () => ({
  ...jest.requireActual('../../hooks/api'),
  useBulkOperationDetails: jest.fn(),
}));

const onEdit = jest.fn();
const onToggle = jest.fn();
const bulkOperation = {
  ...bulkEditLogsData[0],
  status: JOB_STATUSES.DATA_MODIFICATION,
  [FILE_KEYS.MATCHING_RECORDS_LINK]: FILE_KEYS.MATCHING_RECORDS_LINK,
  [FILE_KEYS.UPDATED_RECORDS_LINK]: FILE_KEYS.UPDATED_RECORDS_LINK,
  [FILE_KEYS.MATCHING_ERRORS_LINK]: FILE_KEYS.MATCHING_ERRORS_LINK,
  [FILE_KEYS.UPDATED_ERRORS_LINK]: FILE_KEYS.UPDATED_ERRORS_LINK,
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
          <BulkEditActionMenu onEdit={onEdit} onToggle={onToggle} />
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
      capability: CAPABILITIES.USER,
      providerState: { ...defaultProviderState, visibleColumns: [] },
    });

    expect(screen.getByText('ui-bulk-edit.menuGroup.actions')).toBeVisible();
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

  it('should start bulk edit when inn-app action was called', () => {
    onEdit.mockClear();
    onToggle.mockClear();

    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.ITEM,
      providerState: { ...defaultProviderState, visibleColumns: [], countOfRecords: 10 },
    });

    userEvent.click(screen.getByTestId('startInAppAction'));

    expect(onEdit).toHaveBeenCalledWith(APPROACHES.IN_APP);
    expect(onToggle).toHaveBeenCalled();
  });

  it('should display start csv edit action when it is available', () => {
    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.USER,
      providerState: { ...defaultProviderState, visibleColumns: [], countOfRecords: 10 },
    });

    expect(screen.getByTestId('startCsvAction')).toBeVisible();
  });

  it('should start bulk edit when inn-app action was called', () => {
    onEdit.mockClear();
    onToggle.mockClear();

    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.USER,
      providerState: { ...defaultProviderState, visibleColumns: [], countOfRecords: 10 },
    });

    userEvent.click(screen.getByTestId('startCsvAction'));

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

  it('should change visibleColumns when checkbox is pressed ', () => {
    const setVisibleColumns = jest.fn();

    renderBulkEditActionMenu({
      step: EDITING_STEPS.UPLOAD,
      capability: CAPABILITIES.USER,
      providerState: { ...defaultProviderState, setVisibleColumns, countOfRecords: 1 },
    });

    act(() => userEvent.click(screen.getByText('ui-bulk-edit.columns.USER.uuid')));

    expect(setVisibleColumns).toHaveBeenCalledWith([
      { ...defaultProviderState.visibleColumns[0], selected: true },
      defaultProviderState.visibleColumns[1],
    ]);
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

    act(() => userEvent.click(screen.getByText('ui-bulk-edit.columns.USER.uuid')));

    expect(setVisibleColumns).not.toHaveBeenCalledWith();
  });
});
