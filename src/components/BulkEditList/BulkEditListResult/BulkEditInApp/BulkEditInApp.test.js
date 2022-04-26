import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../../test/jest/__mock__';
import { BulkEditInApp } from './BulkEditInApp';

const renderBulkEditInApp = (title) => {
  render(
    <BulkEditInApp title={title} />,
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
    ];

    const itemFormer = screen.getByRole('option', { name: /layer.options.permanent/ });

    const selectRecordIdentifier = screen.getByTestId('select-option-0');

    options.forEach((el) => expect(screen.getByRole('option', { name: el })).toBeVisible());

    userEvent.selectOptions(
      selectRecordIdentifier,
      itemFormer,
    );

    expect(itemFormer.selected).toBe(true);
  });

  it('should display select correct options in action select', () => {
    renderBulkEditInApp(titleMock);

    const options = [
      /layer.action.replace/,
      /layer.action.clear/,
    ];

    const itemFormer = screen.getByRole('option', { name: /layer.action.replace/ });

    const selectRecordIdentifier = screen.getByTestId('select-actions-0');

    options.forEach((el) => expect(screen.getByRole('option', { name: el })).toBeVisible());

    userEvent.selectOptions(
      selectRecordIdentifier,
      itemFormer,
    );

    expect(itemFormer.selected).toBe(true);
  });
});
