import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import { flushPromises } from '../../../../../test/jest/utils/fileUpload';
import { queryClient } from '../../../../../test/jest/utils/queryClient';

import { CAPABILITIES } from '../../../../constants';

import { BulkEditInApp } from './BulkEditInApp';
import { RootContext } from '../../../../context/RootContext';
import {
  useItemNotes,
  useHoldingsNotes,
  useInstanceNotes,
  useElectronicAccessRelationships,
  useHoldingsNotesEsc,
  useItemNotesEsc,
} from '../../../../hooks/api';


jest.mock('../../../../hooks', () => ({
  ...jest.requireActual('../../../../hooks'),
  useBulkPermissions: jest.fn(),
}));

jest.mock('../../../../hooks/api', () => ({
  ...jest.requireActual('../../../../hooks/api'),
  useItemNotes: jest.fn(),
  useHoldingsNotes: jest.fn(),
  useInstanceNotes: jest.fn(),
  useElectronicAccessRelationships: jest.fn(),
  useHoldingsNotesEsc: jest.fn(),
  useItemNotesEsc: jest.fn(),
}));

const fileName = 'Mock.csv';

const renderBulkEditInApp = ({ capability }) => {
  const params = new URLSearchParams({
    capabilities: capability,
    identifier: 'BARCODE',
    criteria: 'identifier',
    fileName,
  }).toString();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/bulk-edit?${params}`]}>
        <RootContext.Provider value={{
          title: <FormattedMessage id="ui-bulk-edit.preview.file.title" values={{ fileUploadedName: 'fileName' }} />,
        }}
        >
          <BulkEditInApp
            onContentUpdatesChanged={() => {}}
            capabilities={capability}
          />
        </RootContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('BulkEditInApp', () => {
  beforeEach(() => {
    useItemNotes.mockClear().mockReturnValue({
      itemNotes: [],
      isItemNotesLoading: false,
    });

    useHoldingsNotes.mockClear().mockReturnValue({
      holdingsNotes: [],
      isHoldingsNotesLoading: false,
    });

    useInstanceNotes.mockClear().mockReturnValue({
      instanceNotes: [],
      isInstanceNotesLoading: false,
    });

    useElectronicAccessRelationships.mockClear().mockReturnValue({
      electronicAccessRelationships: [],
      isElectronicAccessLoading: false,
    });
    useHoldingsNotesEsc.mockClear().mockReturnValue({
      instanceNotes: [],
      isFetching: false,
    });
    useItemNotesEsc.mockClear().mockReturnValue({
      itemNotes: [],
      isFetching: false,
    });
  });

  it('should display correct title', () => {
    renderBulkEditInApp({ capability: CAPABILITIES.ITEM });

    expect(screen.getByText('ui-bulk-edit.preview.file.title')).toBeVisible();
  });

  it('should display correct Accordion titles', () => {
    const titles = [
      /layer.column.options/,
      /layer.column.actions/,
    ];
    renderBulkEditInApp({ capability: CAPABILITIES.ITEM });

    titles.forEach((el) => expect(screen.getByText(el)).toBeVisible());
  });

  it('should display added row after plus button click', async () => {
    const { getByLabelText, getAllByLabelText } = renderBulkEditInApp({ capability: CAPABILITIES.ITEM });

    const plusButton = getByLabelText('plus-sign');

    expect(plusButton).toBeInTheDocument();

    userEvent.click(plusButton);

    await waitFor(() => {
      expect(getAllByLabelText('plus-sign')).toHaveLength(1);
    });

    const removeButton = getAllByLabelText('trash');

    userEvent.click(removeButton[1]);

    expect(getAllByLabelText('plus-sign')).toHaveLength(1);
  });

  it('should display select right select options on inventory tab', () => {
    const { getByRole } = renderBulkEditInApp({ capability: CAPABILITIES.ITEM });

    const options = [
      /layer.options.permanentLocation/,
      /layer.options.temporaryLocation/,
      /layer.options.statusLabel/,
      /layer.options.permanentLoanType/,
      /layer.options.temporaryLoanType/,
    ];

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });

    userEvent.click(selectionBtn);

    const permanentLocation = getByRole('option', { name: /layer.options.permanentLocation/ });

    options.forEach((el) => expect(getByRole('option', { name: el })).toBeVisible());

    userEvent.click(permanentLocation);
    userEvent.click(selectionBtn);

    expect(permanentLocation).toHaveAttribute('aria-selected', 'false');
  });

  it('should display correct status options in action select', async () => {
    const { getByRole, getByTestId } = renderBulkEditInApp({ capability: CAPABILITIES.ITEM });

    const options = [
      /layer.options.available/,
      /layer.options.missing/,
      /layer.options.withdrawn/,
      /layer.options.non-requestable/,
      /layer.options.intellectual/,
      /layer.options.longMissing/,
      /layer.options.restricted/,
      /layer.options.unavailable/,
      /layer.options.unknown/,
    ];

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    userEvent.click(selectionBtn);

    const optionStatus = getByRole('option', { name: /layer.options.statusLabel/ });
    userEvent.click(optionStatus);

    await waitFor(() => {
      expect(getByTestId('select-actions-1')).toBeInTheDocument();
    });

    const selectAction = getByTestId('select-actions-1');
    const actionReplace = getByRole('option', { name: /layer.action.replace/ });

    act(() => userEvent.selectOptions(selectAction, actionReplace));

    await flushPromises();

    options.forEach((el) => expect(getByRole('option', { name: el })).toBeVisible());

    const selectStatus = getByTestId('select-statuses-1');
    const itemStatus = getByRole('option', { name: /layer.options.missing/ });

    act(() => {
      userEvent.selectOptions(
        selectStatus,
        itemStatus,
      );
    });

    expect(itemStatus.selected).toBeTruthy();
  });

  it('should display item permanent location options', async () => {
    const { getByRole, getByTestId } = renderBulkEditInApp({ capability: CAPABILITIES.ITEM });

    const options = [
      /layer.action.replace/,
      /layer.action.clear/,
      /layer.options.permanentLocation/,
    ];

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    userEvent.click(selectionBtn);

    const optionStatus = getByRole('option', { name: /layer.options.permanentLocation/ });
    userEvent.click(optionStatus);

    await waitFor(() => {
      expect(getByRole('option', { name: /layer.action.replace/ })).toBeInTheDocument();
    });

    const optionReplace = getByRole('option', { name: /layer.action.replace/ });
    const selectAction = getByTestId('select-actions-1');

    userEvent.click(selectionBtn);

    options.forEach((el) => expect(getByRole('option', { name: el })).toBeVisible());

    act(() => userEvent.selectOptions(selectAction, optionReplace));

    expect(optionReplace.selected).toBeTruthy();
  });

  it('should display expiration date', async () => {
    const { getByRole, getByTestId } = renderBulkEditInApp({ capability: CAPABILITIES.USER });

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    userEvent.click(selectionBtn);

    const optionStatus = getByRole('option', { name: /layer.options.expirationDate/ });
    userEvent.click(optionStatus);

    await waitFor(() => {
      expect(getByTestId('dataPicker-experation-date-1')).toBeInTheDocument();
    });

    const dataPicker = getByTestId('dataPicker-experation-date-1');

    userEvent.type(dataPicker, '2000-01-01 00:00:00.000Z');

    expect(dataPicker).toHaveValue('01/01/2000 00:00:00.000Z');
  });

  it('should display patron group', async () => {
    const { getByRole, getByTestId } = renderBulkEditInApp({ capability: CAPABILITIES.USER });

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    userEvent.click(selectionBtn);

    const optionStatus = getByRole('option', { name: /layer.options.patronGroup/ });
    userEvent.click(optionStatus);

    await waitFor(() => {
      expect(getByTestId('select-patronGroup-1')).toBeInTheDocument();
    });

    const selectPatronGroup = getByTestId('select-patronGroup-1');
    const optionPatronGroup = getByRole('option', { name: /layer.selectPatronGroup/ });

    act(() => userEvent.selectOptions(
      selectPatronGroup,
      optionPatronGroup,
    ));

    expect(optionPatronGroup.selected).toBeTruthy();
  });

  it('should display holdings permanent location', async () => {
    const { getByTestId, getByRole } = renderBulkEditInApp({ capability: CAPABILITIES.HOLDING });

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    userEvent.click(selectionBtn);

    const optionStatus = getByRole('option', { name: /layer.options.holdings.permanentLocation/ });
    userEvent.click(optionStatus);

    await waitFor(() => {
      expect(getByRole('option', { name: /layer.action.replace/ })).toBeInTheDocument();
    });

    const actionReplace = getByRole('option', { name: /layer.action.replace/ });
    const selectAction = getByTestId('select-actions-1');

    act(() => userEvent.selectOptions(selectAction, actionReplace));

    userEvent.click(selectionBtn);

    expect(optionStatus).toHaveAttribute('aria-selected', 'false');
  });

  it('should display holdings set to true is checked by default', async () => {
    const { getByRole, getByTestId } = renderBulkEditInApp({ capability: CAPABILITIES.HOLDING });

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    userEvent.click(selectionBtn);

    const optionStatus = getByRole('option', { name: /layer.options.holdings.suppress/ });
    userEvent.click(optionStatus);

    await waitFor(() => {
      expect(getByRole('option', { name: /layer.options.items.true/ })).toBeInTheDocument();
    });

    const actionSetToTrue = getByRole('option', { name: /layer.options.items.true/ });
    const selectAction = getByTestId('select-actions-1');

    act(() => userEvent.selectOptions(selectAction, actionSetToTrue));

    userEvent.click(selectionBtn);

    await waitFor(() => {
      const checkbox = getByRole('checkbox');

      expect(optionStatus).toHaveAttribute('aria-selected', 'false');
      expect(checkbox).toBeChecked();
    });
  });

  it('should display holdings set to false is unchecked by default', async () => {
    const { getByRole, getByTestId } = renderBulkEditInApp({ capability: CAPABILITIES.HOLDING });

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    userEvent.click(selectionBtn);

    const optionStatus = getByRole('option', { name: /layer.options.holdings.suppress/ });
    userEvent.click(optionStatus);

    await waitFor(() => {
      expect(getByRole('option', { name: /layer.options.items.false/ })).toBeInTheDocument();
    });

    const actionSetToFalse = getByRole('option', { name: /layer.options.items.false/ });
    const selectAction = getByTestId('select-actions-1');

    act(() => userEvent.selectOptions(selectAction, actionSetToFalse));

    userEvent.click(selectionBtn);

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox');

      expect(optionStatus).toHaveAttribute('aria-selected', 'false');
      expect(checkbox).not.toBeChecked();
    });
  });

  it('should display holding temporary location options', async () => {
    const { getByTestId, getByRole } = renderBulkEditInApp({ capability: CAPABILITIES.HOLDING });

    const options = [
      /layer.action.replace/,
      /layer.action.clear/,
    ];

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    userEvent.click(selectionBtn);

    const optionStatus = getByRole('option', { name: /layer.options.holdings.temporaryLocation/ });
    userEvent.click(optionStatus);

    await waitFor(() => {
      expect(getByRole('option', { name: /layer.action.replace/ })).toBeInTheDocument();
    });

    const optionReplace = getByRole('option', { name: /layer.action.replace/ });
    const selectAction = getByTestId('select-actions-1');

    options.forEach((el) => expect(getByRole('option', { name: el })).toBeVisible());

    act(() => userEvent.selectOptions(selectAction, optionReplace));

    expect(optionReplace.selected).toBeTruthy();
  });

  it('should render with no axe errors in holding form', async () => {
    renderBulkEditInApp({ capability: CAPABILITIES.HOLDING });

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should render with no axe errors in user form', async () => {
    renderBulkEditInApp({ capability: CAPABILITIES.USER });

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should render with no axe errors in item form', async () => {
    renderBulkEditInApp({ capability: CAPABILITIES.ITEM });

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
