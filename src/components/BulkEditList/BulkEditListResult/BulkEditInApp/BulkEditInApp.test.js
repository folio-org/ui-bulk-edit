import { render, screen, within } from '@testing-library/react';
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
    const removeButton = screen.getAllByLabelText('trash');

    userEvent.click(plusButton);

    options.forEach((el) => expect(screen.getByTestId(el)).toBeVisible());

    removeButton.forEach((el) => userEvent.click(el));

    options.forEach((el) => expect(screen.getByTestId(el)).toBeVisible());
  });

  it('should display select right select options on inventory tab', () => {
    renderBulkEditInApp(titleMock);

    userEvent.click(screen.getByRole('radio', { name: /filters.capabilities.inventory/ }));

    const options = [
      /filters.recordIdentifier.item.barcode/,
      /filters.recordIdentifier.item.UUID/,
      /filters.recordIdentifier.item.ItemHRIDs/,
      /filters.recordIdentifier.item.former/,
      /filters.recordIdentifier.item.accession/,
      /filters.recordIdentifier.item.holdingsUUID/,
    ];

    const itemFormer = screen.getByRole('option', { name: /filters.recordIdentifier.item.former/ });

    const selectRecordIdentifier = screen.getByRole('combobox');

    options.forEach((el) => expect(screen.getByRole('option', { name: el })).toBeVisible());

    userEvent.selectOptions(
      selectRecordIdentifier,
      itemFormer,
    );

    expect(itemFormer.selected).toBe(true);
  });
});
