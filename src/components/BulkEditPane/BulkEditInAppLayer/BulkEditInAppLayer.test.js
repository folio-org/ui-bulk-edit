import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { act, render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import noop from 'lodash/noop';

import { runAxeTest } from '@folio/stripes-testing';

import '../../../../test/jest/__mock__';
import { FormattedMessage } from 'react-intl';
import { flushPromises } from '../../../../test/jest/utils/fileUpload';
import { queryClient } from '../../../../test/jest/utils/queryClient';

import { CAPABILITIES } from '../../../constants';

import { RootContext } from '../../../context/RootContext';
import {
  useItemNotes,
  useHoldingsNotes,
  useInstanceNotes,
  useElectronicAccessRelationships,
  useHoldingsNotesEcs,
  useItemNotesEcs,
  useLocationEcs,
  useLoanTypesEcs,
  useElectronicAccessEcs
} from '../../../hooks/api';
import { BulkEditInAppLayer } from './BulkEditInAppLayer';


jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useBulkPermissions: jest.fn(),
}));

jest.mock('../../../hooks/api', () => ({
  ...jest.requireActual('../../../hooks/api'),
  useItemNotes: jest.fn(),
  useHoldingsNotes: jest.fn(),
  useInstanceNotes: jest.fn(),
  useElectronicAccessRelationships: jest.fn(),
  useHoldingsNotesEcs: jest.fn(),
  useItemNotesEcs: jest.fn(),
  useLocationEcs: jest.fn(),
  useLoanTypesEcs: jest.fn(),
  useElectronicAccessEcs: jest.fn(),
}));

const fileName = 'Mock.csv';

const renderBulkEditInAppLayer = ({ capability }) => {
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
          <BulkEditInAppLayer
            bulkOperationId="bulkOperationId"
            isInAppLayerOpen
            paneProps={{}}
            onInAppLayerClose={noop}
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
    useHoldingsNotesEcs.mockClear().mockReturnValue({
      instanceNotes: [],
      isFetching: false,
    });
    useItemNotesEcs.mockClear().mockReturnValue({
      itemNotes: [],
      isFetching: false,
    });
    useLoanTypesEcs.mockClear().mockReturnValue({
      loantypes: [],
      isFetching: false,
    });
    useElectronicAccessEcs.mockClear().mockReturnValue({
      electronicAccessRelationships: [],
      isFetching: false,
    });
    useLocationEcs.mockClear().mockReturnValue({
      locations: [],
      isFetching: false,
    });
  });

  it('should display correct title', () => {
    renderBulkEditInAppLayer({ capability: CAPABILITIES.ITEM });

    expect(screen.getByText('ui-bulk-edit.preview.file.title')).toBeVisible();
  });

  it('should display correct Accordion titles', () => {
    const titles = [
      /layer.column.options/,
      /layer.column.actions/,
    ];
    renderBulkEditInAppLayer({ capability: CAPABILITIES.ITEM });

    titles.forEach((el) => expect(screen.getByText(el)).toBeVisible());
  });

  it('should display added row after plus button click', async () => {
    const { getByLabelText, getAllByLabelText } = renderBulkEditInAppLayer({ capability: CAPABILITIES.ITEM });

    const plusButton = getByLabelText('plus-sign');

    expect(plusButton).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(plusButton);
    });

    await waitFor(() => {
      expect(getAllByLabelText('plus-sign')).toHaveLength(1);
    });

    const removeButton = getAllByLabelText('trash');

    await act(async () => {
      await userEvent.click(removeButton[1]);
    });

    expect(getAllByLabelText('plus-sign')).toHaveLength(1);
  });

  it('should display select right select options on inventory tab', async () => {
    const { getByRole } = renderBulkEditInAppLayer({ capability: CAPABILITIES.ITEM });

    const options = [
      /layer.options.permanentLocation/,
      /layer.options.temporaryLocation/,
      /layer.options.statusLabel/,
      /layer.options.permanentLoanType/,
      /layer.options.temporaryLoanType/,
    ];

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });

    await act(async () => {
      await userEvent.click(selectionBtn);
    });

    const permanentLocation = getByRole('option', { name: /layer.options.permanentLocation/ });

    options.forEach((el) => expect(getByRole('option', { name: el })).toBeVisible());

    await act(async () => {
      await userEvent.click(permanentLocation);
      await userEvent.click(selectionBtn);
    });

    expect(permanentLocation).toHaveAttribute('aria-selected', 'true');
  });

  it('should display correct status options in action select', async () => {
    const { getByRole, getByTestId } = renderBulkEditInAppLayer({ capability: CAPABILITIES.ITEM });

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
    await act(async () => {
      await userEvent.click(selectionBtn);
    });

    const optionStatus = getByRole('option', { name: /layer.options.statusLabel/ });
    await act(async () => {
      await userEvent.click(optionStatus);
    });

    await waitFor(() => {
      expect(getByTestId('select-actions-1')).toBeInTheDocument();
    });

    const selectAction = getByTestId('select-actions-1');
    const actionReplace = getByRole('option', { name: /layer.action.replace/ });

    await act(async () => {
      await userEvent.selectOptions(selectAction, actionReplace);
    });

    await flushPromises();

    options.forEach((el) => expect(getByRole('option', { name: el })).toBeVisible());

    const selectStatus = getByTestId('select-statuses-1');
    const itemStatus = getByRole('option', { name: /layer.options.missing/ });

    await act(async () => {
      await userEvent.selectOptions(selectStatus, itemStatus);
    });

    expect(itemStatus.selected).toBeTruthy();
  });

  it('should display item permanent location options', async () => {
    const { getByRole, getByTestId } = renderBulkEditInAppLayer({ capability: CAPABILITIES.ITEM });

    const options = [
      /layer.action.replace/,
      /layer.action.clear/,
    ];

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    await act(async () => {
      await userEvent.click(selectionBtn);
    });

    const optionStatus = getByRole('option', { name: /layer.options.permanentLocation/ });
    await act(async () => {
      await userEvent.click(optionStatus);
    });

    await waitFor(() => {
      expect(getByRole('option', { name: /layer.action.replace/ })).toBeInTheDocument();
    });

    const optionReplace = getByRole('option', { name: /layer.action.replace/ });
    const selectAction = getByTestId('select-actions-1');

    await act(async () => {
      await userEvent.click(selectionBtn);
    });

    options.forEach((el) => expect(getByRole('option', { name: el })).toBeVisible());

    await act(async () => {
      await userEvent.selectOptions(selectAction, optionReplace);
    });

    expect(optionReplace.selected).toBeTruthy();
  });

  it('should display expiration date', async () => {
    const { getByRole, getByTestId } = renderBulkEditInAppLayer({ capability: CAPABILITIES.USER });

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    await act(async () => {
      await userEvent.click(selectionBtn);
    });

    const optionStatus = getByRole('option', { name: /layer.options.expirationDate/ });
    await act(async () => {
      await userEvent.click(optionStatus);
    });

    await waitFor(() => {
      expect(getByTestId('dataPicker-experation-date-1')).toBeInTheDocument();
    });

    const dataPicker = getByTestId('dataPicker-experation-date-1');

    await act(async () => {
      await userEvent.type(dataPicker, '2000-01-01 00:00:00.000Z');
    });

    expect(dataPicker).toHaveValue('01/01/2000 00:00:00.000Z');
  });

  it('should display patron group', async () => {
    const { getByRole, getByTestId } = renderBulkEditInAppLayer({ capability: CAPABILITIES.USER });

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    await act(async () => {
      await userEvent.click(selectionBtn);
    });

    const optionStatus = getByRole('option', { name: /layer.options.patronGroup/ });
    await act(async () => {
      await userEvent.click(optionStatus);
    });

    await waitFor(() => {
      expect(getByTestId('select-patronGroup-1')).toBeInTheDocument();
    });

    const selectPatronGroup = getByTestId('select-patronGroup-1');
    const optionPatronGroup = getByRole('option', { name: /layer.selectPatronGroup/ });

    await act(async () => {
      await userEvent.selectOptions(selectPatronGroup, optionPatronGroup);
    });

    expect(optionPatronGroup.selected).toBeTruthy();
  });

  it('should display holdings permanent location', async () => {
    const { getByRole } = renderBulkEditInAppLayer({ capability: CAPABILITIES.HOLDING });

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    await act(async () => {
      await userEvent.click(selectionBtn);
    });

    const optionStatus = getByRole('option', { name: /layer.options.holdings.permanentLocation/ });
    await act(async () => {
      await userEvent.click(optionStatus);
    });

    await waitFor(() => {
      expect(getByRole('option', { name: /layer.action.replace/ })).toBeInTheDocument();
    });
  });

  it('should display holdings set to true is checked by default', async () => {
    const { getByRole, getByTestId } = renderBulkEditInAppLayer({ capability: CAPABILITIES.HOLDING });

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    await act(async () => {
      await userEvent.click(selectionBtn);
    });

    const optionStatus = getByRole('option', { name: /layer.options.holdings.suppress/ });
    await act(async () => {
      await userEvent.click(optionStatus);
    });

    await waitFor(() => {
      expect(getByRole('option', { name: /layer.options.items.true/ })).toBeInTheDocument();
    });

    const actionSetToTrue = getByRole('option', { name: /layer.options.items.true/ });
    const selectAction = getByTestId('select-actions-1');

    await act(async () => {
      await userEvent.selectOptions(selectAction, actionSetToTrue);
      await userEvent.click(selectionBtn);
    });

    await waitFor(() => {
      const checkbox = getByRole('checkbox');

      expect(checkbox).toBeChecked();
    });
  });

  it('should display holdings set to false is unchecked by default', async () => {
    const { getByRole, getByTestId } = renderBulkEditInAppLayer({ capability: CAPABILITIES.HOLDING });

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    await act(async () => {
      await userEvent.click(selectionBtn);
    });

    const optionStatus = getByRole('option', { name: /layer.options.holdings.suppress/ });
    await act(async () => {
      await userEvent.click(optionStatus);
    });

    await waitFor(() => {
      expect(getByRole('option', { name: /layer.options.items.false/ })).toBeInTheDocument();
    });

    const actionSetToFalse = getByRole('option', { name: /layer.options.items.false/ });
    const selectAction = getByTestId('select-actions-1');

    await act(async () => {
      await userEvent.selectOptions(selectAction, actionSetToFalse);
      await userEvent.click(selectionBtn);
    });

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();
    });
  });

  it('should display holding temporary location options', async () => {
    const { getByTestId, getByRole } = renderBulkEditInAppLayer({ capability: CAPABILITIES.HOLDING });

    const options = [
      /layer.action.replace/,
      /layer.action.clear/,
    ];

    const selectionBtn = getByRole('button', { name: /options.placeholder/ });
    await act(async () => {
      await userEvent.click(selectionBtn);
    });

    const optionStatus = getByRole('option', { name: /layer.options.holdings.temporaryLocation/ });
    await act(async () => {
      await userEvent.click(optionStatus);
    });

    await waitFor(() => {
      expect(getByRole('option', { name: /layer.action.replace/ })).toBeInTheDocument();
    });

    const optionReplace = getByRole('option', { name: /layer.action.replace/ });
    const selectAction = getByTestId('select-actions-1');

    options.forEach((el) => expect(getByRole('option', { name: el })).toBeVisible());

    await act(async () => {
      await userEvent.selectOptions(selectAction, optionReplace);
    });

    expect(optionReplace.selected).toBeTruthy();
  });

  it('should render with no axe errors in holding form', async () => {
    renderBulkEditInAppLayer({ capability: CAPABILITIES.HOLDING });

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should render with no axe errors in user form', async () => {
    renderBulkEditInAppLayer({ capability: CAPABILITIES.USER });

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should render with no axe errors in item form', async () => {
    renderBulkEditInAppLayer({ capability: CAPABILITIES.ITEM });

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
