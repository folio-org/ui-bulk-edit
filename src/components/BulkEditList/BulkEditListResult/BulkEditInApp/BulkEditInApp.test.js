import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../../test/jest/__mock__';
import { BulkEditInApp } from './BulkEditInApp';
import { RootContext } from '../../../../context/RootContext';
import { flushPromises } from '../../../../../test/jest/utils/fileUpload';
import { CAPABILITIES } from '../../../../constants';

jest.mock('../../../../hooks/useLoanTypes', () => ({
  useLoanTypes: () => ({ isLoading: false, loanTypes: [] }),
}));

const renderBulkEditInApp = (title, typeOfBulk) => {
  render(
    <RootContext.Provider value={{ setNewBulkFooterShown: jest.fn() }}>
      <BulkEditInApp title={title} onContentUpdatesChanged={() => {}} typeOfBulk={typeOfBulk} />,
    </RootContext.Provider>,
  );
};



const titleMock = 'Mock.csv';

describe('BulkEditInApp', () => {
  it('should display correct title', () => {
    renderBulkEditInApp(titleMock, CAPABILITIES.ITEM);

    expect(screen.getByText(/Mock/)).toBeVisible();
  });

  it('should display correct Accordion titles', () => {
    const titles = [
      /layer.column.options/,
      /layer.column.actions/,
    ];
    renderBulkEditInApp(titleMock, CAPABILITIES.ITEM);

    titles.forEach((el) => expect(screen.getByText(el)).toBeVisible());
  });

  it('should display added row after plus button click', () => {
    const options = [
      'select-option-0',
      'select-option-1',
    ];

    renderBulkEditInApp(titleMock, CAPABILITIES.ITEM);

    const plusButton = screen.getByLabelText('plus-sign');

    userEvent.click(plusButton);

    options.forEach((el) => expect(screen.getByTestId(el)).toBeVisible());

    const removeButton = screen.getAllByLabelText('trash');

    userEvent.click(removeButton[1]);


    expect(screen.queryByTestId('select-option-1')).not.toBeInTheDocument();
  });

  it('should display select right select options on inventory tab', () => {
    renderBulkEditInApp(titleMock, CAPABILITIES.ITEM);

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

    userEvent.selectOptions(
      selectOption,
      permanentLocation,
    );

    expect(permanentLocation.selected).toBe(true);
  });

  it('should display select correct options in action select', async () => {
    renderBulkEditInApp(titleMock, CAPABILITIES.ITEM);

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
    const actionReplace = screen.getByRole('option', { name: /layer.action.replace/ });
    const selectOption = screen.getByTestId('select-option-0');
    const selectAction = screen.getByTestId('select-actions-0');


    userEvent.selectOptions(
      selectAction,
      actionReplace,
    );

    userEvent.selectOptions(
      selectOption,
      optionStatus,
    );

    await flushPromises();

    options.forEach((el) => expect(screen.getByRole('option', { name: el })).toBeVisible());

    const selectStatus = screen.getByTestId('select-status-0');
    const itemStatus = screen.getByRole('option', { name: /layer.options.missing/ });

    userEvent.selectOptions(
      selectStatus,
      itemStatus,
    );

    expect(itemStatus.selected).toBe(true);
  });

  it('should display item status location', () => {
    renderBulkEditInApp(titleMock, CAPABILITIES.ITEM);

    const options = [
      /layer.action.replace/,
      /layer.action.clear/,
    ];

    const optionReplace = screen.getByRole('option', { name: /layer.action.replace/ });
    const selectAction = screen.getByTestId('select-actions-0');

    options.forEach((el) => expect(screen.getByRole('option', { name: el })).toBeVisible());

    userEvent.selectOptions(
      selectAction,
      optionReplace,
    );

    expect(optionReplace.selected).toBe(true);
  });

  it('should display experation date', () => {
    renderBulkEditInApp(titleMock, CAPABILITIES.USER);

    const options = [
      /layer.action.replace/,
      /layer.action.clear/,
    ];

    const optionReplace = screen.getByRole('option', { name: /layer.action.replace/ });
    const selectAction = screen.getByTestId('select-actions-0');
    const selectOption = screen.getByTestId('select-option-0');
    const optionStatus = screen.getByRole('option', { name: /layer.options.expirationDate/ });

    options.forEach((el) => expect(screen.getByRole('option', { name: el })).toBeVisible());

    userEvent.selectOptions(
      selectAction,
      optionReplace,
    );

    userEvent.selectOptions(
      selectOption,
      optionStatus,
    );

    const dataPicker = screen.getByTestId('dataPicker-experation-date-0');

    userEvent.type(dataPicker, '04/05/2022');

    expect(optionReplace.selected).toBe(true);
    expect(dataPicker).toHaveValue('04/05/2022');
  });
});
