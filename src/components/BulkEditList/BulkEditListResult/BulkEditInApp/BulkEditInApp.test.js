import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../../test/jest/__mock__';
import { BulkEditInApp } from './BulkEditInApp';
import { RootContext } from '../../../../context/RootContext';

const renderBulkEditInApp = (title) => {
  render(
    <RootContext.Provider value={{ setNewBulkFooterShown: jest.fn() }}>
      <BulkEditInApp title={title} onContentUpdatesChanged={() => {}} />,
    </RootContext.Provider>,
  );
};

const titleMock = 'Mock.csv';

describe('BulkEditInApp', () => {
  it('should display correct title', () => {
    renderBulkEditInApp(titleMock);

    expect(screen.getByText(/Mock/)).toBeVisible();
  });

  it('should display correct Accordion titles', () => {
    const titles = [
      /layer.column.options/,
      /layer.column.actions/,
    ];
    renderBulkEditInApp(titleMock);

    titles.forEach((el) => expect(screen.getByText(el)).toBeVisible());
  });

  it('should display added row after plus button click', () => {
    const options = [
      'select-option-0',
      'select-option-1',
    ];

    renderBulkEditInApp(titleMock);

    const plusButton = screen.getByLabelText('plus-sign');

    userEvent.click(plusButton);

    options.forEach((el) => expect(screen.getByTestId(el)).toBeVisible());

    const removeButton = screen.getAllByLabelText('trash');

    userEvent.click(removeButton[1]);


    expect(screen.queryByTestId('select-option-1')).not.toBeInTheDocument();
  });

  it('should display select right select options on inventory tab', () => {
    renderBulkEditInApp(titleMock);

    const options = [
      /layer.options.permanent/,
      /layer.options.temporary/,
      /layer.options.statusLabel/,
    ];
    const permanentLocation = screen.getByRole('option', { name: /layer.options.permanent/ });
    const selectOption = screen.getByTestId('select-option-0');

    options.forEach((el) => expect(screen.getByRole('option', { name: el })).toBeVisible());

    userEvent.selectOptions(
      selectOption,
      permanentLocation,
    );

    expect(permanentLocation.selected).toBe(true);
  });

  it('should display select correct options in action select', () => {
    renderBulkEditInApp(titleMock);

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
      selectOption,
      optionStatus,
    );

    userEvent.selectOptions(
      selectAction,
      actionReplace,
    );

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
    renderBulkEditInApp(titleMock);

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

    const textField = screen.getByRole('textbox');

    userEvent.type(textField, 'Test');

    expect(textField).toHaveValue('Test');
  });
});
