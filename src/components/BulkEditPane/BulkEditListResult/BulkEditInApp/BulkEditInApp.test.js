import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useOkapiKy } from '@folio/stripes/core';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';
import { flushPromises } from '../../../../../test/jest/utils/fileUpload';
import { queryClient } from '../../../../../test/jest/utils/queryClient';

import { CAPABILITIES } from '../../../../constants';

import { BulkEditInApp } from './BulkEditInApp';
import { RootContext } from '../../../../context/RootContext';

jest.mock('../../../../hooks/api/usePatronGroup', () => ({
  usePatronGroup: () => ({ userGroups: {} }),
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
        <RootContext.Provider value={{}}>
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
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            usergroups: [{
              value: 'Test',
              desc: 'Test',
            }],
            loantypes: [],
          }),
        }),
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

  it('should display added row after plus button click', () => {
    const options = [
      'select-option-0',
      'select-option-1',
    ];

    renderBulkEditInApp({ capability: CAPABILITIES.ITEM });

    const plusButton = screen.getByLabelText('plus-sign');

    act(() => userEvent.click(plusButton));

    options.forEach((el) => expect(screen.getByTestId(el)).toBeVisible());

    const removeButton = screen.getAllByLabelText('trash');

    userEvent.click(removeButton[1]);


    expect(screen.queryByTestId('select-option-1')).not.toBeInTheDocument();
  });

  it('should display select right select options on inventory tab', () => {
    renderBulkEditInApp({ capability: CAPABILITIES.ITEM });

    const options = [
      /layer.options.permanentLocation/,
      /layer.options.temporaryLocation/,
      /layer.options.statusLabel/,
      /layer.options.permanentLoanType/,
      /layer.options.temporaryLoanType/,
    ];

    const permanentLocation = screen.getByRole('option', { name: /layer.options.permanentLocation/ });
    const selectOption = screen.getByTestId('select-option-0');

    options.forEach((el) => expect(screen.getByRole('option', { name: el })).toBeVisible());

    act(() => {
      userEvent.selectOptions(
        selectOption,
        permanentLocation,
      );
    });

    expect(permanentLocation.selected).toBeTruthy();
  });

  it('should display correct status options in action select', async () => {
    renderBulkEditInApp({ capability: CAPABILITIES.ITEM });

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
    const optionStatus = screen.getByRole('option', { name: /layer.options.statusLabel/ });
    const selectOption = screen.getByTestId('select-option-0');

    act(() => userEvent.selectOptions(selectOption, optionStatus));

    const selectAction = screen.getByTestId('select-actions-1');
    const actionReplace = screen.getByRole('option', { name: /layer.action.replace/ });

    act(() => userEvent.selectOptions(selectAction, actionReplace));

    await flushPromises();

    options.forEach((el) => expect(screen.getByRole('option', { name: el })).toBeVisible());

    const selectStatus = screen.getByTestId('select-statuses-1');
    const itemStatus = screen.getByRole('option', { name: /layer.options.missing/ });

    act(() => {
      userEvent.selectOptions(
        selectStatus,
        itemStatus,
      );
    });

    expect(itemStatus.selected).toBeTruthy();
  });

  it.skip('should display item temporary location options', () => {
    renderBulkEditInApp({ capability: CAPABILITIES.ITEM });

    const options = [
      /layer.action.replace/,
      /layer.action.clear/,
      /layer.options.temporaryLocation/,
    ];

    const selectOption = screen.getByTestId('select-option-0');
    const optionStatus = screen.getByRole('option', { name: /layer.options.temporaryLocation/ });

    act(() => userEvent.selectOptions(selectOption, optionStatus));

    const optionReplace = screen.getByRole('option', { name: /layer.action.replace/ });
    const selectAction = screen.getByTestId('select-actions-1');

    options.forEach((el) => expect(screen.getByRole('option', { name: el })).toBeVisible());

    act(() => userEvent.selectOptions(selectAction, optionReplace));

    expect(optionReplace.selected).toBeTruthy();
  });

  it('should display item permanent location options', () => {
    renderBulkEditInApp({ capability: CAPABILITIES.ITEM });

    const options = [
      /layer.action.replace/,
      /layer.action.clear/,
      /layer.options.permanentLocation/,
    ];

    const selectOption = screen.getByTestId('select-option-0');
    const optionStatus = screen.getByRole('option', { name: /layer.options.permanentLocation/ });

    act(() => userEvent.selectOptions(selectOption, optionStatus));

    const optionReplace = screen.getByRole('option', { name: /layer.action.replace/ });
    const selectAction = screen.getByTestId('select-actions-1');

    options.forEach((el) => expect(screen.getByRole('option', { name: el })).toBeVisible());

    act(() => userEvent.selectOptions(selectAction, optionReplace));

    expect(optionReplace.selected).toBeTruthy();
  });

  it('should display expiration date', () => {
    renderBulkEditInApp({ capability: CAPABILITIES.USER });


    const selectOption = screen.getByTestId('select-option-0');
    const optionStatus = screen.getByRole('option', { name: /layer.options.expirationDate/ });

    act(() => {
      userEvent.selectOptions(
        selectOption,
        optionStatus,
      );
    });

    const dataPicker = screen.getByTestId('dataPicker-experation-date-1');

    userEvent.type(dataPicker, '2000-01-01 00:00:00.000Z');

    expect(dataPicker).toHaveValue('01/01/2000 00:00:00.000Z');
  });

  it('should display patron group', () => {
    renderBulkEditInApp({ capability: CAPABILITIES.USER });

    const selectOption = screen.getByTestId('select-option-0');
    const optionStatus = screen.getByRole('option', { name: /layer.options.patronGroup/ });

    act(() => userEvent.selectOptions(
      selectOption,
      optionStatus,
    ));

    const selectPatronGroup = screen.getByTestId('select-patronGroup-1');
    const optionPatronGroup = screen.getByRole('option', { name: /layer.selectPatronGroup/ });

    act(() => userEvent.selectOptions(
      selectPatronGroup,
      optionPatronGroup,
    ));

    expect(optionPatronGroup.selected).toBeTruthy();
  });

  it('should display holdings permanent location', async () => {
    renderBulkEditInApp({ capability: CAPABILITIES.HOLDING });

    let selectOption;
    let optionStatus;

    await waitFor(() => {
      selectOption = screen.getByTestId('select-option-0');
      optionStatus = screen.getByRole('option', { name: /layer.options.holdings.permanentLocation/ });
    });

    act(() => userEvent.selectOptions(selectOption, optionStatus));

    const actionReplace = screen.getByRole('option', { name: /layer.action.replace/ });
    const selectAction = screen.getByTestId('select-actions-1');

    expect(screen.queryByRole('option', { name: /layer.action.clear/ })).not.toBeInTheDocument();

    act(() => userEvent.selectOptions(selectAction, actionReplace));

    expect(optionStatus.selected).toBeTruthy();
  });

  it('should display holdings set to true is checked by default', () => {
    renderBulkEditInApp({ capability: CAPABILITIES.HOLDING });

    const selectOption = screen.getByTestId('select-option-0');
    const optionStatus = screen.getByRole('option', { name: /layer.options.holdings.suppress/ });

    act(() => userEvent.selectOptions(selectOption, optionStatus));

    const actionSetToTrue = screen.getByRole('option', { name: /layer.options.items.true/ });
    const selectAction = screen.getByTestId('select-actions-1');

    act(() => userEvent.selectOptions(selectAction, actionSetToTrue));


    waitFor(() => {
      const checkbox = screen.getByRole('checkbox');

      expect(optionStatus.selected).toBeTruthy();
      expect(checkbox).toBeChecked();
    });
  });

  it('should display holdings set to false is unchecked by default', () => {
    renderBulkEditInApp({ capability: CAPABILITIES.HOLDING });

    const selectOption = screen.getByTestId('select-option-0');
    const optionStatus = screen.getByRole('option', { name: /layer.options.holdings.suppress/ });

    act(() => userEvent.selectOptions(selectOption, optionStatus));

    const actionSetToFalse = screen.getByRole('option', { name: /layer.options.items.false/ });
    const selectAction = screen.getByTestId('select-actions-1');

    act(() => userEvent.selectOptions(selectAction, actionSetToFalse));

    waitFor(() => {
      const checkbox = screen.getByRole('checkbox');

      expect(optionStatus.selected).toBeTruthy();
      expect(checkbox).not.toBeChecked();
    });
  });

  it('should display holding temporart location options', () => {
    renderBulkEditInApp({ capability: CAPABILITIES.HOLDING });

    const options = [
      /layer.action.replace/,
      /layer.action.clear/,
    ];

    const selectOption = screen.getByTestId('select-option-0');
    const optionStatus = screen.getByRole('option', { name: /layer.options.holdings.temporaryLocation/ });

    act(() => userEvent.selectOptions(selectOption, optionStatus));

    const optionReplace = screen.getByRole('option', { name: /layer.action.replace/ });
    const selectAction = screen.getByTestId('select-actions-1');

    options.forEach((el) => expect(screen.getByRole('option', { name: el })).toBeVisible());

    act(() => userEvent.selectOptions(selectAction, optionReplace));

    expect(optionReplace.selected).toBeTruthy();
  });

  it('should display added row after plus button click in holdings tab', () => {
    const options = [
      'select-option-0',
      'select-option-1',
    ];

    renderBulkEditInApp({ capability: CAPABILITIES.HOLDING });

    const plusButton = screen.getByLabelText('plus-sign');

    act(() => userEvent.click(plusButton));

    options.forEach((el) => expect(screen.getByTestId(el)).toBeVisible());

    const removeButton = screen.getAllByLabelText('trash');

    act(() => userEvent.click(removeButton[1]));

    expect(screen.queryByTestId('select-option-1')).not.toBeInTheDocument();
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
